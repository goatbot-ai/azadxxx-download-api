# Official PHP Apache image
FROM php:8.2-apache

# Enable URL rewrite if needed
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy all project files to container
COPY . /var/www/html/

# Install dependencies for youtube-dl (if needed)
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    pip3 install --upgrade youtube_dl

# Expose port 80
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]
