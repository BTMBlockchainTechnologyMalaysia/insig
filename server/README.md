# server

## Installation

The server requires a redis server to run in order to cache some information.

The recomended options is by using [docker](https://www.docker.com/) and the [respetive docker image](https://hub.docker.com/_/redis).

It should run on defult port '6379'.

This could be achived using the following command `docker run --name insig-redis -p 6379:6379 --rm -d redis:5.0.5`

If you want a redis client app, it's recomended to us [redis desktop manager](http://docs.redisdesktop.com/en/latest/install/).
```