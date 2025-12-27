# File Storage - 文件存儲規範

> **技能 ID**: file-storage
> **版本**: v1.0
> **用途**: 提供雲端文件存儲最佳實踐，涵蓋 AWS S3、Azure Blob、阿里雲 OSS 等

---

## 🎯 觸發條件

### 關鍵字列表
```
文件上傳、file upload、OSS、S3、Azure Blob、
雲存儲、cloud storage、文件管理、圖片上傳、
CDN、文件下載、presigned URL
```

### 使用場景
1. **文件上傳** - 用戶頭像、文檔附件
2. **圖片處理** - 縮圖生成、格式轉換
3. **大文件分片** - 斷點續傳、分片上傳
4. **安全訪問** - 預簽名 URL、權限控制

---

## 🏗️ 核心規範

### 1. 文件存儲架構

```
Client (Browser/App)
    │
    ▼ 1. 請求上傳憑證
┌─────────────┐
│   API Server  │
└─────────────┘
    │
    ▼ 2. 生成 Presigned URL
┌─────────────┐
│  Cloud Storage │ ◄─── 3. 直接上傳
│  (S3/OSS/Blob) │
└─────────────┘
    │
    ▼ 4. CDN 分發
┌─────────────┐
│     CDN      │
└─────────────┘
```

### 2. 文件命名規範

```typescript
// ✅ 推薦的文件路徑結構
const generatePath = (userId: string, type: string, filename: string) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const uuid = crypto.randomUUID();
  const ext = path.extname(filename).toLowerCase();

  // 格式: {type}/{year}/{month}/{userId}/{uuid}.{ext}
  // 示例: avatars/2025/01/user123/abc-123.jpg
  return `${type}/${year}/${month}/${userId}/${uuid}${ext}`;
};
```

### 3. 上傳前驗證

```typescript
interface UploadPolicy {
  maxSize: number;           // 最大文件大小 (bytes)
  allowedTypes: string[];    // 允許的 MIME 類型
  allowedExts: string[];     // 允許的擴展名
}

const POLICIES: Record<string, UploadPolicy> = {
  avatar: {
    maxSize: 5 * 1024 * 1024,  // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExts: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  document: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'application/msword'],
    allowedExts: ['.pdf', '.doc', '.docx'],
  },
};

function validateFile(file: File, policy: UploadPolicy): void {
  if (file.size > policy.maxSize) {
    throw new ValidationError(`File size exceeds ${policy.maxSize / 1024 / 1024}MB`);
  }
  if (!policy.allowedTypes.includes(file.type)) {
    throw new ValidationError(`File type ${file.type} not allowed`);
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!policy.allowedExts.includes(ext)) {
    throw new ValidationError(`Extension ${ext} not allowed`);
  }
}
```

---

## 📖 實現模式

### AWS S3 (Node.js)

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 生成上傳 Presigned URL
async function getUploadUrl(key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 小時
}

// 生成下載 Presigned URL
async function getDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 });
}
```

### 阿里雲 OSS (Java)

```java
@Service
public class OssService {
    private final OSS ossClient;
    private final String bucketName;

    // 生成上傳 URL
    public String generateUploadUrl(String objectKey, long expireSeconds) {
        Date expiration = new Date(System.currentTimeMillis() + expireSeconds * 1000);

        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(
            bucketName, objectKey, HttpMethod.PUT);
        request.setExpiration(expiration);

        URL url = ossClient.generatePresignedUrl(request);
        return url.toString();
    }

    // 分片上傳
    public String multipartUpload(String objectKey, File file) {
        InitiateMultipartUploadRequest initRequest =
            new InitiateMultipartUploadRequest(bucketName, objectKey);

        InitiateMultipartUploadResult initResult =
            ossClient.initiateMultipartUpload(initRequest);

        String uploadId = initResult.getUploadId();
        // ... 分片上傳邏輯
        return objectKey;
    }
}
```

### 前端直傳

```typescript
// React 組件示例
async function uploadFile(file: File, type: string) {
  // 1. 驗證文件
  validateFile(file, POLICIES[type]);

  // 2. 獲取預簽名 URL
  const { uploadUrl, fileKey } = await api.getUploadCredential({
    filename: file.name,
    contentType: file.type,
    type,
  });

  // 3. 直接上傳到雲存儲
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  // 4. 通知後端上傳完成
  await api.confirmUpload({ fileKey });

  return fileKey;
}
```

---

## 🔧 進階功能

### 1. 圖片處理 (On-the-fly)

```typescript
// 使用 CDN 圖片處理參數
function getImageUrl(key: string, options: ImageOptions): string {
  const baseUrl = `https://cdn.example.com/${key}`;
  const params = new URLSearchParams();

  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.format) params.set('f', options.format);
  if (options.quality) params.set('q', String(options.quality));

  return `${baseUrl}?${params.toString()}`;
}

// 使用示例
const thumbnailUrl = getImageUrl('avatars/user123.jpg', {
  width: 200,
  height: 200,
  format: 'webp',
  quality: 80,
});
```

### 2. 斷點續傳

```typescript
interface ChunkUploadState {
  fileId: string;
  totalChunks: number;
  uploadedChunks: number[];
}

async function resumeUpload(file: File, state: ChunkUploadState) {
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    if (state.uploadedChunks.includes(i)) continue; // 跳過已上傳

    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    await uploadChunk(state.fileId, i, chunk);
    state.uploadedChunks.push(i);

    // 保存進度
    saveProgress(state);
  }

  // 合併分片
  await mergeChunks(state.fileId, totalChunks);
}
```

---

## ❌ 禁止事項

### 1. 客戶端暴露雲端密鑰
```javascript
// ❌ 絕對禁止
const s3 = new S3Client({
  credentials: {
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',  // 暴露密鑰！
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  },
});

// ✅ 使用後端生成預簽名 URL
const uploadUrl = await api.getPresignedUrl();
```

### 2. 不驗證文件類型
```javascript
// ❌ 危險：可能上傳惡意文件
app.post('/upload', (req, res) => {
  const file = req.files.file;
  file.mv(`/uploads/${file.name}`); // 無驗證！
});

// ✅ 驗證文件類型
if (!ALLOWED_TYPES.includes(file.mimetype)) {
  throw new Error('Invalid file type');
}
```

### 3. 使用原始文件名
```javascript
// ❌ 路徑遍歷風險
const filename = req.body.filename; // "../../etc/passwd"
fs.writeFile(`/uploads/${filename}`, data);

// ✅ 使用 UUID
const filename = `${crypto.randomUUID()}${path.extname(originalName)}`;
```

---

## ✅ 自我檢查清單

- [ ] 文件上傳使用預簽名 URL（不暴露密鑰）
- [ ] 驗證文件類型、大小、擴展名
- [ ] 使用 UUID 重命名文件（避免路徑遍歷）
- [ ] 私有文件使用有時效的訪問 URL
- [ ] 大文件實現分片上傳
- [ ] 配置了 CDN 加速
- [ ] 設置了存儲生命週期規則

---

## 💡 記憶口訣

**上傳流程**: 預簽 URL → 直傳雲端 → 確認回調
**文件安全**: 驗類型、限大小、改名字
**訪問控制**: 公有 CDN、私有簽名、時效限制
**大文件**: 分片傳、可續傳、後合併
