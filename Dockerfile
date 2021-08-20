FROM httpd:2.4
# assumes you ran `npm run build`
COPY ./build /usr/local/apache2/htdocs/
