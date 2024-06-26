FROM node:latest AS client
ADD ./client /client
WORKDIR /client

RUN npm i
RUN npm run build

FROM golang:latest AS bin
ADD . /gobin
WORKDIR /gobin
RUN go build -o app_bin main.go

FROM alpine:latest
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=bin /gobin/app_bin bin
COPY --from=client /client/dist ./client/dist

CMD ["./bin"]
