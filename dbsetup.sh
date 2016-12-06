#!/bin/bash

dbname="miljul2"
mysqlusername="root"
mysqlpassword="altanaimysql"
miljulmysqlusername="miljul"
directory="mysql"
# echo "Enter your mysql usernname"
# read mysqlusername

# echo "Enter your mysql password"
# read mysqlpassword


# echo "Enter your miljul db usernname"
# read miljulmysqlusername

# Functions
ok() { echo -e '\e[32m'$dbname'\e[m'; } # Green

EXPECTED_ARGS=4
E_BADARGS=65
MYSQL=`which mysql`
 
Q1="CREATE DATABASE IF NOT EXISTS $dbname;"
Q2="GRANT ALL ON *.* TO '$miljulmysqlusername'@'localhost' IDENTIFIED BY '$mysqlpassword';"
Q3="FLUSH PRIVILEGES;"

SQL="${Q1}${Q2}${Q3}"

# echo $#

# if [ $# -ne $EXPECTED_ARGS ]
# then
#   echo "Usage: $0 $dbname $mysqlusername $miljulmysqlusername"
#   exit $E_BADARGS
# fi
 
$MYSQL -u $mysqlusername -p$mysqlpassword -e "$SQL"

ok "Database $dbname and user $miljulmysqlusername created with a password $miljulmysqlusername"


# mysql -u $mysqlusername -p$mysqlpassword -D${dbname}  << EOF
#   $Q4
# EOF

 # mysql -s -u $miljulmysqlusername -p$mysqlpassword  -D${dbname} -e "${Q4}"

$MYSQL  -s -u $miljulmysqlusername -p$mysqlpassword  -D${dbname} < "mysql/providers.sql"
$MYSQL -s -u $miljulmysqlusername -p$mysqlpassword  -D${dbname} < "mysql/contacts.sql"
$MYSQL -s -u $miljulmysqlusername -p$mysqlpassword  -D${dbname} < "mysql/passwordchange.sql"
$MYSQL -s -u $miljulmysqlusername -p$mysqlpassword  -D${dbname} < "mysql/developer.sql"
$MYSQL -s -u $miljulmysqlusername -p$mysqlpassword  -D${dbname} < "mysql/sessionhistory.sql"