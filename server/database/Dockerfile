FROM postgres:latest

# create database
ENV POSTGRES_PASSWORD postgres

# create user
ENV POSTGRES_USER postgres

# set database
ENV POSTGRES_DB postgres

# copy create db script
COPY ./scripts/createdb.sql /docker-entrypoint-initdb.d/

# expose port
EXPOSE 5432

# run the app
CMD ["postgres"]
