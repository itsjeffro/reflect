# Reflect

Note taking application which works as a Desktop application (with Electron), or via the browser.

<p align="center">
  <img src="./art/preview.png">
</p>

## Tech

- Frontend (Vite)
- Desktop application (Electron)

## Auth and token management

The application uses an external API built with Laravel using the Laravel Sanctum package.

### Via Browser

During logins, the Larval login endpoint will create a cookie on the backend. Which ensures that the cookies cannot be tampered with from the frontend. During each subsequent request the `httpClient` use the following config:

```json
{
  "withCredentials": true,
  "withXSRFToken": true
}
```

### Via Desktop application (Electron)

During logins, a token is created. The created token is stored using the exposed Electron bridge APIs which set/get the token that is persisted on the desktop rather than in the web browser.

During each subsequent request the `httpClient` will retrieve the stored token and use it in the `Authorization` header.
