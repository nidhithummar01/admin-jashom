# ---------- Build stage ----------
    FROM node:20-alpine AS builder
 
    WORKDIR /app
     
    COPY package*.json ./
    RUN npm ci
     
    COPY . .
    RUN npm run build
     
     
    # ---------- Runtime stage ----------
    FROM nginxinc/nginx-unprivileged:1.27-alpine
     
    # Remove default config
    RUN rm /etc/nginx/conf.d/default.conf
     
    # Copy built assets
    COPY --from=builder /app/dist /usr/share/nginx/html
     
    # Copy custom nginx config
    COPY nginx.conf /etc/nginx/conf.d/default.conf
     
    EXPOSE 8080
     
    CMD ["nginx", "-g", "daemon off;"]