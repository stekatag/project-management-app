###########################################
# Production Image - PHP-FPM + NGINX
###########################################
FROM serversideup/php:8.4-fpm-nginx

# Switch to root to install packages
USER root

# Install additional PHP extensions
RUN install-php-extensions \
    intl \
    gd \
    exif \
    bcmath

# Install Node.js and pnpm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY --chown=www-data:www-data . .

# Create required directories with proper permissions before composer install
RUN mkdir -p \
    bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/app/public \
    storage/logs && \
    chown -R www-data:www-data bootstrap/cache storage && \
    chmod -R 775 bootstrap/cache storage

# Switch to www-data for installations
USER www-data

# Install Composer dependencies
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# Install Node dependencies and build frontend assets
RUN pnpm install && \
    pnpm run build

# Switch back to www-data
USER www-data

# Set environment variables for production
ENV PHP_OPCACHE_ENABLE=1
ENV PHP_OPCACHE_MEMORY_CONSUMPTION=256
ENV PHP_OPCACHE_MAX_ACCELERATED_FILES=20000
ENV PHP_MEMORY_LIMIT=512M
ENV PHP_MAX_UPLOAD_SIZE=100M
ENV PHP_MAX_EXECUTION_TIME=300
ENV SSL_MODE=off

# Laravel automations - automatically run on container startup
ENV AUTORUN_ENABLED=true
ENV AUTORUN_LARAVEL_STORAGE_LINK=true
ENV AUTORUN_LARAVEL_MIGRATION=true
ENV AUTORUN_LARAVEL_MIGRATION_ISOLATION=false
ENV AUTORUN_LARAVEL_CONFIG_CACHE=true
ENV AUTORUN_LARAVEL_ROUTE_CACHE=true
ENV AUTORUN_LARAVEL_VIEW_CACHE=true
ENV AUTORUN_LARAVEL_EVENT_CACHE=false

# Health check using Laravel's built-in health check endpoint
ENV HEALTHCHECK_PATH=/up

# Expose port (NGINX default is 8080)
EXPOSE 8080

# The serversideup/php image will automatically handle:
# - Creating storage symlink (storage:link)
# - Running database migrations (migrate --force)
# - Caching config, routes, and views
# - Ensuring database is ready before migrations