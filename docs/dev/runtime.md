---
status: draft
tags:
  - draft
---
### Runtime Component Architecture

```mermaid
graph LR
  subgraph Runtime Context
    Drupal["Drupal (extends Core)
    - config: StorageInterface
    - client: XhrInterface
    - session: SessionInterface"]
    Core["Core
    - getClientService()
    - getConfigService()
    - getSessionService()"]
    Config["Config (StorageInMemory)"]
    Xhr["XHR Clients
    - FetchClient
    - AxiosClient"]
    Error["DrupalError"]
    Storage["Storage
    - StorageInMemory
    - StorageInWeb"]
    Auth["DrupalAuth
    - login/logout
    - csrftoken/session"]
    EntitySvc["EntityService
    - registerAdapter
    - entity(id) → EntityLoader"]
    EntityLoader["EntityLoader
    - load(id)"]
    JsonApiAdapter["JsonApiEntityAdapter
    - load → client.call(GET)"]
  end

  Drupal -->|init| Xhr
  Drupal -->|uses| Core
  Core -->|wraps| Config
  Core -->|provides| Xhr
  Core -->|provides| Storage

  Auth -->|uses| Drupal
  Auth -->|calls| Xhr
  Auth -->|sets| Storage
  Auth -->|adds headers| Xhr

  EntitySvc -->|uses| Core
  EntitySvc -->|creates| EntityLoader
  JsonApiAdapter -->|calls| Xhr
  EntityLoader -->|uses| JsonApiAdapter

  Xhr -->|errors| Error
  Storage -->|errors| Error
```

!!! note

    - `Drupal` composes the HTTP client and exposes it via `Core.getClientService()`.
    - `DrupalAuth` persists CSRF/logout tokens in session storage and injects the `X-CSRF-Token` header via `XhrInterface.addDefaultHeaders()`.
    - Entities are accessed through `EntityService` which instantiates an adapter (default: JSON:API).



### ERD (Entity-Relationship) View

```mermaid
---
config:
  theme: redux-color
  look: neo
---
erDiagram
  DRUPAL ||--|| CORE : "extends"
  CORE ||--|| CONFIG : "wraps"
  CORE ||--o{ XHR : "provides"
  CORE ||--o{ STORAGE : "provides"
  DRUPAL ||--o{ XHR : "init client"

  DRUPALAUTH }|..|| DRUPAL : "uses"
  DRUPALAUTH }o..o{ XHR : "calls"
  DRUPALAUTH }o..|| STORAGE : "persists"

  ENTITYSERVICE }|..|| CORE : "uses"
  ENTITYSERVICE ||--o{ ENTITYLOADER : "creates"
  ENTITYLOADER }|..|| JSONAPIADAPTER : "uses"
  JSONAPIADAPTER }o..o{ XHR : "calls"

  XHR }o..|| DRUPALERROR : "throws"
  STORAGE }o..|| DRUPALERROR : "throws"

  DRUPAL {
    string baseURL
    string client
    string config
    string session
  }
  CORE {
    string config
  }
  CONFIG {
    string data
  }
  XHR {
    string impl
  }
  STORAGE {
    string impl
  }
  DRUPALAUTH {
    string csrf_token
    string logout_token
    string current_user
  }
  ENTITYSERVICE {
    string defaultAdapterKey
  }
  ENTITYLOADER {
    string operation
  }
  JSONAPIADAPTER {
    string operation
  }
  DRUPALERROR {
    int code
    string message
  }
```

