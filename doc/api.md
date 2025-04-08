# API doc

API definition for the web music player client. For communication between the
client and the server, we will use RESTful API.

### get playlists

- method: `GET`
- path: `/api/list`
- description: Get the all playlists
- response:

```json
[
  {
    "id": 1,
    "name": "My Playlist",
    "songs": [
      1,
      2
      // ...
    ]
  }
]
```

### add playlist

- method: `POST`
- path: `/api/list`
- description: Add a new playlist
- request:

```json
{
  "name": "My Playlist",
  "songs": [
    1,
    3,
    4
    // ...
  ]
}
```

- response:

```json
{
  "id": 1,
  "name": "My Playlist",
  "songs": [
    1,
    3,
    4
  ]
}
```

### get playlist detail

- method: `GET`
- path: `/api/list/{id}`
- description: Get the detail of a playlist
- response:

```json
{
  "id": 1,
  "name": "My Playlist",
  "songs": [
    1,
    2
    // ...
  ]
}
```

### update playlist detail

- method: `PUT`
- path: `/api/list/{id}`
- description: Update a playlist
- request:

```json
{
  "name": "My Playlist",
  "songs": [
    1,
    2
    // ...
  ]
}
```

- response:

```json
{
  "id": 1,
  "name": "My Playlist",
  "songs": [
    1,
    2
    // ...
  ]
}
```

### delete playlist

- method: `DELETE`
- path: `/api/list/{id}`
- description: Delete a playlist

### get music list

- method: `GET`
- path: `/api/music`
- description: Get the all music files
- response:

```json
[
  {
    "id": 1,
    "title": "Song 1",
    "artist": "Artist 1",
    "album": "Album 1",
    "duration": 123
  }
  // ...
]
```

### add music

- method: `POST`
- path: `/api/music`
- description: Add a new music file
- request:

```json
{
  "title": "Song 1",
  "artist": "Artist 1",
  "album": "Album 1",
  "duration": 123
}
```

- response:

```json
{
  "id": 1,
  "title": "Song 1",
  "artist": "Artist 1",
  "album": "Album 1",
  "duration": 123
}
```

### get music detail

- method: `GET`
- path: `/api/music/{id}`
- description: Get the detail of a music file
- response:

```json
{
  "id": 1,
  "title": "Song 1",
  "artist": "Artist 1",
  "album": "Album 1",
  "duration": 123
}
```

### update music detail

`WARNING: not recommended to use this api`

- method: `PUT`
- path: `/api/music/{id}`
- description: Update a music file
- request:

```json
{
  "title": "Song 1",
  "artist": "Artist 1",
  "album": "Album 1",
  "duration": 123,
  "path": "/path/to/it"
}
```

- response:

```json
{
  "id": 1,
  "title": "Song 1",
  "artist": "Artist 1",
  "album": "Album 1",
  "duration": 123
}
```

### delete music

- method: `DELETE`
- path: `/api/music/{id}`
- description: Delete a music file

### get music file

- method: `GET`
- path: `/api/music/{id}/file`
- description: Get a music file stream
- response:
  - `audio/mp3`
  - `audio/flac`
