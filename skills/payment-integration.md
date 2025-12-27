# Payment Integration - 支付整合規範

> **技能 ID**: payment-integration
> **版本**: v1.0
> **用途**: 提供安全的支付系統整合指南，涵蓋 Stripe、PayPal、支付寶、微信支付等

---

## 🎯 觸發條件

### 關鍵字列表
```
支付、payment、Stripe、PayPal、支付寶、微信支付、
訂單、checkout、付款、退款、refund、
訂閱、subscription、計費、billing
```

### 使用場景
1. **電商支付** - 商品購買、訂單支付
2. **訂閱服務** - 週期性付款、會員訂閱
3. **退款處理** - 全額/部分退款
4. **支付安全** - PCI DSS 合規

---

## 🏗️ 核心規範

### 1. 支付流程架構

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Client   │────▶│  API Server │────▶│  Payment   │
│ (Browser)  │     │             │     │  Gateway   │
└────────────┘     └────────────┘     └────────────┘
      │                  │                   │
      │ 1. 建立訂單      │                   │
      │ ─────────────────▶                   │
      │                  │ 2. 創建支付意向   │
      │                  │ ─────────────────▶│
      │                  │                   │
      │ 3. 返回 client_secret              │
      │ ◀─────────────────                   │
      │                  │                   │
      │ 4. 確認支付 (前端 SDK)              │
      │ ────────────────────────────────────▶│
      │                  │                   │
      │                  │ 5. Webhook 回調   │
      │                  │ ◀─────────────────│
      │                  │                   │
      │ 6. 更新訂單狀態  │                   │
      │ ◀─────────────────                   │
```

### 2. 訂單狀態機

```typescript
enum OrderStatus {
  PENDING = 'pending',           // 待支付
  PROCESSING = 'processing',     // 支付中
  PAID = 'paid',                 // 已支付
  SHIPPED = 'shipped',           // 已發貨
  COMPLETED = 'completed',       // 已完成
  CANCELLED = 'cancelled',       // 已取消
  REFUNDING = 'refunding',       // 退款中
  REFUNDED = 'refunded',         // 已退款
}

// 狀態轉換規則
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.PAID, OrderStatus.PENDING],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.REFUNDING],
  [OrderStatus.SHIPPED]: [OrderStatus.COMPLETED, OrderStatus.REFUNDING],
  [OrderStatus.COMPLETED]: [OrderStatus.REFUNDING],
  [OrderStatus.REFUNDING]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: [],
  [OrderStatus.CANCELLED]: [],
};
```

---

## 📖 實現模式

### Stripe (Node.js)

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 1. 創建支付意向
async function createPaymentIntent(orderId: string, amount: number, currency: string) {
  const order = await db.order.findUnique({ where: { id: orderId } });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // 轉換為分
    currency,
    metadata: {
      orderId,
      userId: order.userId,
    },
    automatic_payment_methods: { enabled: true },
  });

  // 保存 paymentIntentId
  await db.order.update({
    where: { id: orderId },
    data: { paymentIntentId: paymentIntent.id },
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
}

// 2. Webhook 處理
async function handleWebhook(req: Request) {
  const sig = req.headers['stripe-signature']!;
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
  }

  return { received: true };
}

// 3. 退款處理
async function createRefund(orderId: string, amount?: number) {
  const order = await db.order.findUnique({ where: { id: orderId } });

  const refund = await stripe.refunds.create({
    payment_intent: order.paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined, // 部分退款
    reason: 'requested_by_customer',
  });

  await db.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.REFUNDING,
      refundId: refund.id,
    },
  });

  return refund;
}
```

### 前端支付 (React)

```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
      },
    });

    if (error) {
      setError(error.message ?? 'Payment failed');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

// 使用
function CheckoutPage({ orderId }: { orderId: string }) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    api.createPaymentIntent(orderId).then(({ clientSecret }) => {
      setClientSecret(clientSecret);
    });
  }, [orderId]);

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
```

---

## 🔧 關鍵安全措施

### 1. Webhook 驗證

```typescript
// ✅ 驗證 Webhook 簽名
function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

### 2. 金額一致性檢查

```typescript
// ✅ 後端驗證金額
async function validatePayment(paymentIntent: Stripe.PaymentIntent) {
  const order = await db.order.findUnique({
    where: { id: paymentIntent.metadata.orderId },
  });

  const expectedAmount = Math.round(order.totalAmount * 100);

  if (paymentIntent.amount !== expectedAmount) {
    throw new Error('Amount mismatch detected!');
  }
}
```

### 3. 冪等性處理

```typescript
// ✅ 使用 Idempotency Key 防止重複扣款
const paymentIntent = await stripe.paymentIntents.create(
  {
    amount: 2000,
    currency: 'usd',
  },
  {
    idempotencyKey: `order_${orderId}_attempt_${attemptNumber}`,
  }
);
```

---

## ❌ 禁止事項

### 1. 客戶端傳金額
```javascript
// ❌ 絕對禁止（用戶可篡改金額）
await api.pay({
  orderId: '123',
  amount: 0.01, // 用戶改成 1 分錢！
});

// ✅ 後端從訂單獲取金額
const order = await db.order.findUnique({ where: { id: orderId } });
const amount = order.totalAmount; // 後端計算的金額
```

### 2. 不驗證 Webhook
```javascript
// ❌ 危險：任何人都能偽造回調
app.post('/webhook', (req, res) => {
  handlePaymentSuccess(req.body); // 無驗證！
});

// ✅ 驗證簽名
const event = stripe.webhooks.constructEvent(
  req.body,
  req.headers['stripe-signature'],
  WEBHOOK_SECRET
);
```

### 3. 暴露 Secret Key
```javascript
// ❌ 絕對禁止
// 前端代碼
const stripe = new Stripe('sk_live_xxx'); // Secret Key 暴露！

// ✅ 前端只用 Publishable Key
const stripe = loadStripe('pk_live_xxx');
```

### 4. 不處理失敗情況
```javascript
// ❌ 只考慮成功
await stripe.confirmPayment();
window.location.href = '/success';

// ✅ 處理所有情況
const { error, paymentIntent } = await stripe.confirmPayment();
if (error) {
  showError(error.message);
} else if (paymentIntent.status === 'succeeded') {
  redirect('/success');
} else {
  showPending();
}
```

---

## ✅ 自我檢查清單

### 安全性
- [ ] 金額在後端計算，不信任前端
- [ ] Webhook 已驗證簽名
- [ ] Secret Key 不暴露給前端
- [ ] 使用 HTTPS 通信

### 可靠性
- [ ] 實現了冪等性（防重複扣款）
- [ ] Webhook 有重試機制
- [ ] 訂單狀態機正確
- [ ] 有完整的錯誤處理

### 合規性
- [ ] 符合 PCI DSS 要求
- [ ] 敏感卡號不經過伺服器
- [ ] 有完整的支付日誌
- [ ] 退款流程符合規定

---

## 💡 記憶口訣

**支付流程**: 後端創建 → 前端確認 → Webhook 完成
**安全原則**: 金額後端算、簽名必驗證、密鑰不暴露
**狀態管理**: 待付 → 支付中 → 已付 → 完成/退款
**冪等處理**: 唯一 Key、防重試、狀態機
