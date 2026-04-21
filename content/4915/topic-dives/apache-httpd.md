---
id: 4915-topic-apache-httpd
title: Apache httpd
pillar: tech
priority: high
chapter: Mod08 Ch26
tags:
  - networking
  - network
---

Daemon `httpd`. Config `/etc/httpd/conf/httpd.conf`.

Three logical sections: **Global** (ServerRoot, Listen, Load modules), **Main Server** (ServerName, DocumentRoot, <Directory>), **VirtualHosts**.

DocumentRoot default `/var/www/html`. `<Directory>` blocks control per-directory rules.

```apache
<Directory "/var/www/html/private">
  AuthType Basic
  AuthName "Restricted"
  AuthUserFile /etc/httpd/passwd
  Require valid-user
  AllowOverride None
</Directory>
```

`.htaccess` per-directory (only if AllowOverride allows). `htpasswd -c /etc/httpd/passwd user` creates password file.

```apache
<VirtualHost *:80>
  ServerName site1.example.com
  DocumentRoot /var/www/site1
</VirtualHost>
```

Validate/list: `httpd -t`, `httpd -S`. Control: `apachectl start/stop/restart/graceful` or `systemctl`. User/Group directive: runs as `apache`.

Ports 80 HTTP, 443 HTTPS. Logs `/var/log/httpd/access_log`, `error_log`.
