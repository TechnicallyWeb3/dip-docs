---
id: wttp-permissions
title: WTTP Permissions
---

# WTTP Permissions and Access Control

WTTP Site implements a sophisticated role-based access control (RBAC) system that allows you to fine-tune who can access and modify different parts of your on-chain website. This system provides both security and flexibility for managing your site's content and functionality.

## Permission System Overview

The permission system is built on top of OpenZeppelin's AccessControl and uses a hierarchical role structure with resource-specific permissions.

### Core Roles

#### DEFAULT_ADMIN_ROLE
- **Purpose**: Ultimate control over the entire site
- **Capabilities**: Can perform any action, bypass all restrictions
- **Assignment**: Set during deployment, typically to the deployer
- **Use Case**: Emergency recovery, site ownership transfer

#### SITE_ADMIN_ROLE
- **Purpose**: Manage site-wide configuration and settings
- **Capabilities**: 
  - Modify site headers and CORS policies
  - Manage other roles and permissions
  - Configure cache settings
  - Cannot bypass resource-specific restrictions
- **Assignment**: Granted by DEFAULT_ADMIN_ROLE
- **Use Case**: Site administrators, content managers

#### Resource Roles
- **Purpose**: Control access to specific paths or file patterns
- **Capabilities**: Read, write, or modify specific resources as set in CORS
- **Assignment**: Created dynamically for specific paths
- **Use Case**: Team members with limited access, public content areas

#### Public Access
- **Purpose**: Allow anyone to access certain resources
- **Capabilities**: Read, write, or modify specific resources as set in CORS
- **Assignment**: Configured per resource
- **Use Case**: Public websites, documentation, marketing pages

#### Blacklist
- **Purpose**: Explicitly deny access to specific addresses
- **Capabilities**: Blocks all access regardless of other permissions
- **Assignment**: Set by administrators
- **Use Case**: Block malicious users, temporary restrictions

## Role Management

### Creating Resource Roles

```typescript
// Create a resource role for moderators
const modRole = ethers.keccak256(ethers.toUtf8Bytes('MODERATOR_ROLE'));
await site.createResourceRole(modRole);

// Grant the role to a specific address
await site.grantRole(modRole, modAddress);

// Revoke the role
await site.revokeRole(modRole, modAddress);
```

### Checking Permissions

```typescript
// Check if an address has a specific role
const hasModRole = await site.hasRole(modRole, userAddress);

```

### Role Hierarchy

```
DEFAULT_ADMIN_ROLE
    ↓
SITE_ADMIN_ROLE
    ↓
Resource Roles
    ↓
Public Access
    ↓
Blacklist (explicit denial)
```

## Resource-Level Permissions

### Resource-Based Access Control

You can create roles for specific resources or use DEFINE for redirects and folder definitions:

```typescript
// Admin-only section
const modRole = ethers.keccak256(ethers.toUtf8Bytes('MODERATOR_ROLE'));

// API endpoints
const apiRole = ethers.keccak256(ethers.toUtf8Bytes('API_ROLE'));

// Specific file
const configRole = ethers.keccak256(ethers.toUtf8Bytes('CONFIG_ROLE'));

// Public content
const publicRole = ethers.keccak256(ethers.toUtf8Bytes('PUBLIC_ROLE'));
```

### Method-Specific Permissions

Each HTTP method can have different permission requirements:

```typescript
// Read-only access
const readOnlyRole = ethers.keccak256(ethers.toUtf8Bytes('READONLY_ROLE'));

// Write access
const writeRole = ethers.keccak256(ethers.toUtf8Bytes('WRITE_ROLE'));

// Admin access (all methods)
const modRole = ethers.keccak256(ethers.toUtf8Bytes('MODERATOR_ROLE'));
```

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured at the resource level:

```typescript
// Create role groups for different access levels
const moderatorsRole = ethers.keccak256(ethers.toUtf8Bytes('MODERATORS_ROLE'));
const editorsRole = ethers.keccak256(ethers.toUtf8Bytes('EDITORS_ROLE'));
const authorsRole = ethers.keccak256(ethers.toUtf8Bytes('AUTHORS_ROLE'));
const publicRole = ethers.keccak256(ethers.toUtf8Bytes('PUBLIC_ROLE'));

// Create the roles
await site.createResourceRole(moderatorsRole);
await site.createResourceRole(editorsRole);
await site.createResourceRole(authorsRole);
await site.createResourceRole(publicRole);

// Grant roles to addresses
await site.grantRole(moderatorsRole, moderatorAddress);
await site.grantRole(editorsRole, editorAddress);
await site.grantRole(authorsRole, authorAddress);
await site.grantRole(publicRole, PUBLIC_ROLE);

const headerInfo: HeaderInfo = {
  cors: {
    methods: 0xffff, // Bitmask of allowed methods
    origins: [
      moderatorsRole, // Method 0 (HEAD)
      moderatorsRole, // Method 1 (GET)
      moderatorsRole, // Method 2 (POST)
      editorsRole,    // Method 3 (PUT)
      editorsRole,    // Method 4 (PATCH)
      moderatorsRole, // Method 5 (DELETE)
      moderatorsRole, // Method 6 (OPTIONS)
      moderatorsRole, // Method 7 (LOCATE)
      moderatorsRole  // Method 8 (DEFINE)
    ]
  },
  cache: { maxAge: 3600, immutableFlag: false },
  redirect: { code: 0, location: '' }
};
```

### Method Bitmask

The methods bitmask uses individual bits to represent allowed methods:

```typescript
const METHODS = {
  HEAD:    0x001,  // 1
  GET:     0x002,  // 2
  POST:    0x004,  // 4
  PUT:     0x008,  // 8
  PATCH:   0x010,  // 16
  DELETE:  0x020,  // 32
  OPTIONS: 0x040,  // 64
  LOCATE:  0x080,  // 128
  DEFINE:  0x100   // 256
};

// Allow GET and HEAD only
const readOnly = METHODS.GET | METHODS.HEAD; // 0x006

// Allow all methods
const allMethods = 0xffff;
```

## Permission Presets

WTTP Site includes several permission presets for common use cases:

### Static Website
```bash
npx hardhat site:deploy --header-preset static-website --network localhost
```
- **Public Access**: All content readable by anyone
- **Admin Only**: Only site admins can modify content
- **CORS**: Same-origin policy
- **Cache**: Standard 1-hour caching

### Dynamic API
```bash
npx hardhat site:deploy --header-preset dynamic-api --network localhost
```
- **API Access**: Controlled access to API endpoints
- **CORS**: Configurable for multiple origins
- **Cache**: Disabled for dynamic content
- **Methods**: Full HTTP method support

### Immutable Content
```bash
npx hardhat site:deploy --header-preset immutable --network localhost
```
- **Read-Only**: Content cannot be modified after creation
- **Public Access**: Anyone can read content
- **Cache**: Long-term caching (1 year)
- **ETags**: Strong validation

## Security Best Practices

### 1. Principle of Least Privilege
- Grant only the minimum permissions necessary
- Use resource-specific roles instead of broad admin access
- Regularly audit and revoke unused permissions

### 2. Role Separation
- Separate content creators from site administrators
- Use different roles for different content areas
- Implement approval workflows for sensitive content

### 3. Regular Audits
- Periodically review who has access to what
- Monitor for unusual access patterns
- Keep logs of permission changes

### 4. Emergency Procedures
- Always maintain DEFAULT_ADMIN_ROLE access
- Have a recovery plan for lost keys
- Test permission changes on testnet first

## Common Permission Patterns

### Public Website
```typescript
// All content publicly readable
const publicRole = ethers.keccak256(ethers.toUtf8Bytes('PUBLIC_ROLE'));
await site.grantRole(publicRole, PUBLIC_ROLE);

// Only admins can modify
const adminRole = ethers.keccak256(ethers.toUtf8Bytes('SITE_ADMIN_ROLE'));
await site.connect(owner).grantRole(adminRole, adminAddress);
```

### Team Collaboration
```typescript
// Different teams for different sections
const frontendRole = ethers.keccak256(ethers.toUtf8Bytes('FRONTEND_ROLE'));
const backendRole = ethers.keccak256(ethers.toUtf8Bytes('BACKEND_ROLE'));
const docsRole = ethers.keccak256(ethers.toUtf8Bytes('DOCS_ROLE'));

await site.grantRole(frontendRole, frontendTeamAddress);
await site.grantRole(backendRole, backendTeamAddress);
await site.grantRole(docsRole, docsTeamAddress);
```

### API with Authentication
```typescript
// Public read access to API docs
const apiDocsRole = ethers.keccak256(ethers.toUtf8Bytes('API_DOCS_ROLE'));
await site.grantRole(apiDocsRole, docsAddress);

// Authenticated access to API endpoints
const apiRole = ethers.keccak256(ethers.toUtf8Bytes('API_ROLE'));
await site.grantRole(apiRole, authenticatedUserAddress);
```

## Troubleshooting Permissions

### Common Issues

1. **403 Forbidden**: Check if the user has the required role
2. **Method Not Allowed**: Verify the method is allowed for the resource
3. **CORS Errors**: Check origin configuration in CORS headers
4. **Blacklist**: Ensure the address isn't on the blacklist

### Debugging Steps

1. Check user roles: `await site.hasRole(role, userAddress)`
2. Test resource access by calling the method directly
3. Review CORS configuration by checking the resource's header
4. Check if the user has the required role for the method

## Migration and Updates

### Adding New Roles
```typescript
// Create new role
const newRole = ethers.keccak256(ethers.toUtf8Bytes('NEW_SECTION_ROLE'));
await site.createResourceRole(newRole);

// Grant to users
await site.grantRole(newRole, userAddress);
```

### Updating Permissions
```typescript
// Revoke old permissions
await site.revokeRole(oldRole, userAddress);

// Grant new permissions
await site.grantRole(newRole, userAddress);
```

### Emergency Access
```typescript
// Grant temporary admin access
await site.grantRole(DEFAULT_ADMIN_ROLE, emergencyAddress);

// Revoke after emergency is resolved
await site.revokeRole(DEFAULT_ADMIN_ROLE, emergencyAddress);
```

### Emergency Admin Revoke
```typescript
// Create the new admin group
const newAdminRole = ethers.keccak256(ethers.toUtf8Bytes('NEW_ADMIN_ROLE'));
// Change the admin role group
await site.changeSiteAdmin(newAdminRole);
// Now you can fix admin access and revert back to SITE_ADMIN_ROLE if you wish
```

## Related Documentation

- [ESP Overview](/docs/esp/esp-overview) - Learn about the Ethereum Storage Protocol
- [ESP Storage](/docs/esp/esp-storage) - Detailed storage mechanisms
