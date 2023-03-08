FROM node:14

# Create directory for source code and set as working directory
RUN mkdir -p /usr/local/src
WORKDIR /usr/local/src

# Install OpenSSH
RUN apt-get update && apt-get -y install openssh-server && echo "root:Docker!" | chpasswd 

# Copy the sshd_config file to the /etc/ssh/ directory
COPY docker/sshd_config /etc/ssh/

# Copy and configure the ssh_setup file
RUN mkdir -p /tmp
COPY docker/ssh_setup.sh /tmp
RUN chmod +x /tmp/ssh_setup.sh && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null)

# # Set environment variables
# ENV HOST=0.0.0.0
# ENV PORT=1337
# ENV APP_KEYS=
# ENV API_TOKEN_SALT=
# ENV ADMIN_JWT_SECRET=
# ENV JWT_SECRET=
# ENV DATABASE_NAME=orqaDB
# ENV DATABASE_USERNAME=admin
# ENV DATABASE_PASSWORD=
# ENV DATABASE_SSL=false
# ENV DATABASE_PORT=3306
# ENV DATABASE_HOST=
# ENV PUBLIC_URL=
# #http://wejustwanttoaccessthedatabase.sub02061436140.orqatestnetwork.oraclevcn.com
# #http://130.162.168.182:1337
# ENV PUBLIC_ADMIN_URL=
# ENV BUCKET_URL=
# ENV NUMBERCOMPARISONIMAGES=5
# ENV NUMBERGRADINGIMAGES=5

# Copy source code to image
COPY config ./config
COPY database ./database
COPY public ./public
COPY src ./src
COPY package.json ./
#COPY favicon.ico ./

# Install from source
RUN yarn install

# Build app in production mode
RUN NODE_ENV=production yarn build

EXPOSE 8080 2222

COPY docker/entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Start app when container starts
ENTRYPOINT [ "bash", "entrypoint.sh"]
