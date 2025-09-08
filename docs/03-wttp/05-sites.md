---
id: wttp-sites
title: WTTP Sites
---

# WTTP Sites

WTTP Site provides comprehensive tools for managing your on-chain websites, from initial deployment to ongoing maintenance and updates. This guide covers all aspects of site lifecycle management.

## Site Lifecycle Overview

```
Deployment → Configuration → Content Upload → Management → Updates → Maintenance
     ↓            ↓              ↓             ↓          ↓         ↓
  Deploy      Set Headers    Upload Files   Monitor    Update    Optimize
  Contract    & Permissions  & Resources    Usage      Content   Performance
```

## Site Deployment

### Basic Deployment
Deploy a new site with default settings:

```bash
npx hardhat site:deploy --network localhost
```

### Advanced Deployment
Deploy with custom configuration:

```bash
npx hardhat site:deploy \
  --header-preset dynamic-api \
  --cors-preset allow-wttp \
  --cache-preset standard \
  --network sepolia
```

### Deployment Parameters

| Parameter | Description | Options |
|-----------|-------------|---------|
| `--header-preset` | Pre-configured header settings | `static-website`, `dynamic-api`, `immutable` |
| `--cors-preset` | CORS policy configuration | `allow-all`, `same-origin`, `allow-wttp` |
| `--cache-preset` | Caching behavior | `aggressive`, `standard`, `none` |
| `--network` | Target blockchain network | `localhost`, `sepolia`, `polygon` |

## Site Configuration

### Initial Setup
After deployment, configure your site:

```typescript
// Set up basic headers
const headerInfo: HeaderInfo = {
  cors: {
    methods: 0xffff, // Allow all methods
    origins: Array(9).fill(PUBLIC_ROLE) // Allow all origins (this is dangerous since public will be able to write, update, delete and alter all resources on your site)
  },
  cache: {
    maxAge: 3600, // 1 hour cache
    immutableFlag: false
  },
  redirect: {
    code: 0, // No redirect
    location: ''
  }
};

await site.DEFINE('/', headerInfo);
```

### CORS Configuration
Configure cross-origin resource sharing:

```typescript
// Allow specific roles for different methods
const corsOrigins = [
  PUBLIC_ROLE,      // HEAD
  PUBLIC_ROLE,      // GET
  PUBLIC_ROLE,      // POST
  EDITOR_ROLE,      // PUT
  EDITOR_ROLE,      // PATCH
  SITE_ADMIN_ROLE,  // DELETE
  PUBLIC_ROLE,      // OPTIONS
  PUBLIC_ROLE,      // LOCATE
  SITE_ADMIN_ROLE   // DEFINE
];

const headerInfo: HeaderInfo = {
  cors: {
    methods: 0xffff,
    origins: corsOrigins
  },
  cache: { maxAge: 3600, immutableFlag: false },
  redirect: { code: 0, location: '' }
};
```

### Cache Configuration
Set up caching policies:

```typescript
// Aggressive caching for static assets
const staticHeader: HeaderInfo = {
  cors: { methods: 0x004, origins: Array(9).fill(PUBLIC_ROLE) }, // GET only
  cache: { maxAge: 31536000, immutableFlag: true }, // 1 year
  redirect: { code: 0, location: '' }
};

await site.DEFINE('/static/*', staticHeader);

// No caching for dynamic content
const dynamicHeader: HeaderInfo = {
  cors: { methods: 0xffff, origins: Array(9).fill(PUBLIC_ROLE) },
  cache: { maxAge: 0, immutableFlag: false },
  redirect: { code: 0, location: '' }
};

await site.DEFINE('/api/*', dynamicHeader);
```

## Content Management

### Uploading Content
Upload files to your site:

```bash
# Upload entire directory
npx hardhat site:upload \
  --site 0x1234... \
  --source ./public \
  --network localhost

# Upload specific file
npx hardhat site:upload \
  --site 0x1234... \
  --source ./index.html \
  --path /index.html \
  --network localhost
```

### Programmatic Upload
Upload content programmatically:

```typescript
// Upload HTML file
const htmlContent = ethers.toUtf8Bytes(`
<!DOCTYPE html>
<html>
<head><title>My Site</title></head>
<body><h1>Hello World</h1></body>
</html>
`);

const dataRegistration = [{
  data: htmlContent,
  publisher: signer.address
}];

await site.PUT('/index.html', dataRegistration);
```

### Batch Upload
Upload multiple files efficiently:

```typescript
// Upload multiple files in a single transaction
const files = [
  { path: '/index.html', content: htmlContent },
  { path: '/style.css', content: cssContent },
  { path: '/script.js', content: jsContent }
];

const dataRegistrations = files.map(file => ({
  data: file.content,
  publisher: signer.address
}));

await site.PUT('/batch-upload', dataRegistrations);
```

## Site Monitoring

### Health Checks
Monitor your site's health:

```typescript
// Check if site is responding
const healthCheck = await site.HEAD({ path: '/' });
console.log('Site status:', healthCheck.status);

// Check specific resources
const resourceCheck = await site.HEAD({ path: '/api/health' });
console.log('API status:', resourceCheck.status);
```

### Usage Analytics
Track site usage by monitoring contract events:

```typescript
// Get site statistics by monitoring events
// Note: You'll need to implement event monitoring in your application
// or use a service like The Graph to index contract events

// Example: Monitor resource creation events
site.on('PUTSuccess', (sender, response) => {
  console.log('New resource created:', response.head.metadata);
});

site.on('PATCHSuccess', (sender, response) => {
  console.log('Resource updated:', response.head.metadata);
});
```

### Performance Monitoring
Monitor site performance:

```typescript
// Measure response times
const startTime = Date.now();
const response = await site.GET({ path: '/large-file.pdf' });
const responseTime = Date.now() - startTime;

console.log('Response time:', responseTime, 'ms');
console.log('Content size:', response.data.length, 'bytes');
```

## Content Updates

### Updating Existing Content
Update content using PUT or PATCH:

```typescript
// Complete replacement
const newContent = ethers.toUtf8Bytes('<h1>Updated Content</h1>');
await site.PUT('/index.html', [{ data: newContent, publisher: signer.address }]);

// Partial update
const patchData = ethers.toUtf8Bytes('updated section');
const range = { start: 100, end: 200 };
await site.PATCH('/index.html', range, patchData);
```

### Version Control
Implement version control for your content:

```typescript
// Create versioned content
const version = Date.now();
await site.PUT(`/v${version}/index.html`, [{ data: content, publisher: signer.address }]);

// Update current version
await site.DEFINE('/index.html', {
  redirect: { code: 302, location: `/v${version}/index.html` }
});
```

### Rollback Capability
Implement rollback functionality:

```typescript
// Store previous version
const previousVersion = await site.getContentHash('/index.html');
await site.createResourceReference('/index.html.backup', previousVersion);

// Rollback to previous version
const backupHash = await site.getContentHash('/index.html.backup');
await site.updateResourceContent('/index.html', backupHash);
```

## Site Maintenance

### Content Cleanup
Remove unused content:

```typescript
// Delete old content
await site.DELETE('/old-file.html');

// Clean up unused resources
const unusedResources = await site.getUnusedResources();
for (const resource of unusedResources) {
  await site.DELETE(resource.path);
}
```

### Performance Optimization
Optimize site performance:

```typescript
// Compress content
const compressedContent = gzipSync(originalContent);
await site.PUT('/compressed-file.html', [{ data: compressedContent, publisher: signer.address }]);

// Set appropriate headers
const optimizedHeader: HeaderInfo = {
  cors: { methods: 0x004, origins: Array(9).fill(PUBLIC_ROLE) },
  cache: { maxAge: 86400, immutableFlag: true }, // 1 day
  redirect: { code: 0, location: '' }
};

await site.DEFINE('/static/*', optimizedHeader);
```

### Security Updates
Keep your site secure:

```typescript
// Update permissions
const newRole = ethers.keccak256(ethers.toUtf8Bytes('/admin/*'));
await site.createResourceRole(newRole);
await site.grantRole(newRole, newAdminAddress);

// Revoke old permissions
await site.revokeRole(oldRole, oldAdminAddress);
```

## Site Backup and Recovery

### Backup Creation
Create site backups by monitoring contract events:

```typescript
// Note: Backup requires monitoring contract events
// You'll need to implement event monitoring or use a service like The Graph

// Example backup structure
const backup = {
  siteAddress: site.address,
  resources: [],
  timestamp: Date.now()
};

// Monitor events to build backup
site.on('PUTSuccess', (sender, response) => {
  backup.resources.push({
    path: response.head.metadata.properties.path,
    contentLength: response.head.metadata.properties.contentLength,
    contentType: response.head.metadata.properties.contentType,
    dataPoints: response.resource.dataPoints
  });
});

// Save backup to file
fs.writeFileSync('site-backup.json', JSON.stringify(backup, null, 2));
```

### Site Recovery
Restore from backup:

```typescript
// Load backup
const backup = JSON.parse(fs.readFileSync('site-backup.json', 'utf8'));

// Restore resources
for (const resource of backup.resources) {
  const putRequest = {
    head: { path: resource.path },
    properties: {
      contentType: resource.contentType,
      contentLength: resource.contentLength
    },
    data: [] // Would need to reconstruct from dataPoints
  };
  await site.PUT(putRequest);
}
```

## Multi-Site Management

### Site Registry
Manage multiple sites:

```typescript
// Deploy multiple sites
const sites = [];
for (let i = 0; i < 3; i++) {
  const site = await deploySite(`Site ${i}`);
  sites.push(site);
}

// Track sites in your application
const siteRegistry = {
  sites: sites.map(site => ({
    address: site.address,
    name: `Site ${sites.indexOf(site)}`,
    deployedAt: Date.now()
  }))
};
```

### Site Federation
Federate multiple sites:

```typescript
// Create roles for federated sites
const site1Role = ethers.keccak256(ethers.toUtf8Bytes('SITE1_ROLE'));
const site2Role = ethers.keccak256(ethers.toUtf8Bytes('SITE2_ROLE'));
const site3Role = ethers.keccak256(ethers.toUtf8Bytes('SITE3_ROLE'));

await site.createResourceRole(site1Role);
await site.createResourceRole(site2Role);
await site.createResourceRole(site3Role);

// Grant roles to site addresses
await site.grantRole(site1Role, site1Address);
await site.grantRole(site2Role, site2Address);
await site.grantRole(site3Role, site3Address);

// Configure cross-site CORS
const federationHeader: HeaderInfo = {
  cors: {
    methods: 0xffff,
    origins: [
      site1Role, // Method 0 (HEAD)
      site1Role, // Method 1 (GET)
      site1Role, // Method 2 (POST)
      site2Role, // Method 3 (PUT)
      site2Role, // Method 4 (PATCH)
      site1Role, // Method 5 (DELETE)
      site1Role, // Method 6 (OPTIONS)
      site1Role, // Method 7 (LOCATE)
      site1Role  // Method 8 (DEFINE)
    ]
  },
  cache: { maxAge: 3600, immutableFlag: false },
  redirect: { code: 0, location: '' }
};

await site.DEFINE({ head: { path: '/federated' }, data: federationHeader });
```


## Troubleshooting

### Common Issues

1. **Deployment Failures**: Check gas limits and network connectivity
2. **Upload Errors**: Verify file permissions and content size
3. **Access Issues**: Check CORS configuration and permissions
4. **Performance Problems**: Optimize content and caching

### Debugging Tools

```typescript
// Enable debug logging
const debugMode = true;
if (debugMode) {
  console.log('Site address:', site.address);
  console.log('Network:', await site.provider.getNetwork());
  console.log('Owner:', await site.owner());
}

// Check site health by testing basic functionality
const healthCheck = await site.HEAD({ path: '/' });
console.log('Site health status:', healthCheck.status);
```

### Recovery Procedures

1. **Site Unresponsive**: Check contract state and network connectivity
2. **Content Missing**: Verify resource existence and permissions
3. **Permission Issues**: Review role assignments and CORS settings
4. **Performance Degradation**: Analyze usage patterns and optimize content

## Best Practices

### 1. Site Design
- Plan your site structure before deployment
- Use logical directory hierarchies
- Implement consistent naming conventions

### 2. Content Management
- Regular backups and version control
- Monitor usage and performance
- Optimize content for your use case

### 3. Security
- Implement least-privilege access control
- Regular security audits
- Monitor for unauthorized changes

### 4. Performance
- Use appropriate caching strategies
- Optimize content size and format
- Monitor and analyze performance metrics

## Related Documentation

- [ESP Overview](/docs/esp/esp-overview) - Learn about the Ethereum Storage Protocol
- [ESP Storage](/docs/esp/esp-storage) - Detailed storage mechanisms
