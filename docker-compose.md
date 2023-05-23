
## Mention the Version of Docker

```sh
version: "3.8"
```
We have to mention the current version of docker, that we are using.

## Run Services in Docker
```sh
services:
  mysql_service:
    image: mysql
    ports:
      - 3306:3306
    networks:
      - nestjs_api
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_ROOT_PASSWORD: example
```

The word `Services` here is representing services that we are gonna run in docker. I define `mysql_service` that will database in docker. 
- Inside **mysql_service** I use the keyword `image`, docker will automatically download all the dependencies for mysql if first time you don't have.
- `ports` keyword defining the port in docker like the left side **3306** is defining the original port on mysql and on the other hand (right side). I again define the **3306**, docker will get this port run **mysql container** on that port. We can write any port we want.
- `network` keyword I define the array of network that will synced with network from outside of services.
- `restart` this property will restart container everytime if something went wrong.
- `environment` We can define environment for that **mysql_service**.

## Network
```sh
networks:
  nestjs_api:
```
This `network` property create the network, which our container will use to communicate with different service.
*Note: We only have one service right now with the name of `mysql_service`. This will help if we will have multiple services in docker-compose file.*

****Helping source****
I took help from [Dillinger] to write `.md` file.
Guide for `docker-compose` [here]


<!--- Links -->

[here]: <https://www.youtube.com/watch?v=HG6yIjZapSA&ab_channel=ProgrammingwithMosh/>
[Dillinger]: <https://dillinger.io/>