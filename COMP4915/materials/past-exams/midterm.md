# Comp 4915 Midterm, Spring 2026, Version 1

100 minute time limit, 144 total marks

The following questions relate to the Linux operating system and related utilities.

There is one best answer for each question. Fill in the answer for each multiple choice or true/false question on the general purpose answer sheet provided (op scan). Write the answers to the short answer / essay questions on this question booklet.

Each multiple choice question is worth 2 marks. Each true-false question is worth 1 mark. Each short answer question is worth 3 marks and each essay question is worth ten marks.

The midterm as a whole is worth 20% of the course mark.

Fill in your name, set, and date on this page.

On the scantron sheet, in the name field, put your last name, a space, then your first name with your set in the last column. Enter your student number in the id field, with the initial A replaced by 0. Fill in the test version.

## MULTIPLE CHOICE
Choose the one alternative that best completes the statement or answers the question.

1) What is a secure technology for serving files over the internet?
   - A) ftp://
   - B) sftp
   - C) http
   - D) ssh
   - E) ftp

2) After mounting the Windows 11 d: partition onto a Linux system at the mount point /mnt/win, what would you type (in Linux) to change to the directory that corresponds to the Windows directory d:\work\faxes?
   - A) cd /work/faxes
   - B) cd /mnt/win/work/faxes
   - C) cd /mnt/win
   - D) cd /dev/hda1/work/faxes
   - E) cd /dev/hdb1/work/faxes

3) What utility allows forwarding a port through an encrypted connection that it establishes?
   - A) ssh
   - B) iptables
   - C) rpc
   - D) ipchains
   - E) portmap

4) To send the output of a Linux command to a file and also to standard output, use the _______ command.
   - A) redirection
   - B) >>
   - C) switch
   - D) tee
   - E) >

5) At a shell prompt in Linux, what does typing "cd ~" do?
   - A) Take you one directory up from your current directory.
   - B) Switch to a root account.
   - C) change to the directory ~ under your working directory.
   - D) Switch to your account's home directory.
   - E) List the current directory.

6) What would you type in Linux to locate a file named foo, when you have no idea where it is located in the file system hierarchy?
   - A) find -name foo
   - B) find foo
   - C) find / -name foo
   - D) find / foo
   - E) whereis foo

7) Linux has become more popular with businesses in recent years because
   - A) the code is free.
   - B) Linux is commonly used by technical programmers.
   - C) Linux is easier to use and more user-friendly than the alternative operating systems available for the PC.
   - D) Linux is a descendent of the popular MINIX operating system.
   - E) Linux is perceived to be more reliable, higher performance and more secure than alternative PC operating systems

8) The Linux command that displays the system manual for most utilities is called
   - A) disp
   - B) info
   - C) man
   - D) mozilla
   - E) sysman

9) What does the Unix command grep do?
   - A) Displays the processes that are running (but not their PIDs).
   - B) Displays the current processes that are running and their PIDs.
   - C) Displays who is logged onto the system.
   - D) Reads through a file and displays the text searched for.
   - E) Dumps the output of a file to your screen in octal format.

10) Which of the following Unix commands directs standard output to outfile and standard error to errfile?
    - A) make FreeCiv >outfile 2>errfile
    - B) make FreeCiv >outfile 0>errfile
    - C) make FreeCiv >outfile 1>errfile
    - D) make FreeCiv <outfile 2<errfile
    - E) make FreeCiv >errfile 2>outfile

11) In a typical Linux system, which of the following files contains a list of all the hosts that are not allowed to access your computer's network services?
    - A) /usr/hosts.deny
    - B) /etc/hosts.deny
    - C) /etc/deny
    - D) /usr/deny
    - E) There is no such file

12) When running a command in the bash shell, how do you indicate that it should run in the background?
    - A) Pipe the command to the background process.
    - B) Terminate the command with the character '#'
    - C) Terminate the command with the character '&'
    - D) Terminate the command with the character '%'
    - E) Type CONTROL-B

13) Which command allows you to connect to a Linux system and securely run remote programs.
    - A) rsh
    - B) telnet
    - C) ssh
    - D) rlogin
    - E) login

14) What does the Unix command tr do?
    - A) Translates a shell script to perl.
    - B) Moves a process to the foreground.
    - C) Translates a program from C to assembler.
    - D) Maps one string of characters to another.
    - E) Matches any single character.

15) How can you exit a shell in Unix without typing any command?
    - A) CONTROL-X
    - B) CONTROL-Q
    - C) CONTROL-C
    - D) CONTROL-D
    - E) CONTROL-Z

16) How do you make jack the owner of all the files under the Unix directory /home/jack/candy?
    - A) chown -changes jack /home/jack/candy
    - B) chown -R jack /home/jack/candy
    - C) chmod u+rwx /home/jack/candy
    - D) chown -r jack /home/jack/candy
    - E) chmod a+rwx jack /home/jack/candy

17) Assume that you have made the following Unix assignment:
    `bash$ person=jenny`
    What is the output of the the Unix command: `echo '$person'`
    - A) person
    - B) jenny
    - C) '$person'
    - D) $person
    - E) $jenny

18) Which of the following is the Unix root directory?
    - A) /root
    - B) root
    - C) c:/
    - D) root/
    - E) /

19) What service would you install if you wanted to offer remote mounting of Linux partitions on a local Linux-only network?
    - A) FIPS
    - B) NIS
    - C) SMB
    - D) DNS
    - E) NFS

20) By default, Linux command arguments are separated by _______.
    - A) Spaces or tabs
    - B) spaces, tabs or vertical tabs
    - C) Spaces
    - D) any white-space characters

21) Which of the following is not a metacharacter used in a Linux regular expression?
    - A) $
    - B) ^
    - C) =
    - D) .
    - E) all of the above are metacharacters used in regular expressions.

22) One special Linux account, called the _______ has special privileges for administering the system.
    - A) slash.dot
    - B) Gnome
    - C) instructor
    - D) Superuser
    - E) There is no account with special privileges, the privileges can be added to any account.

23) Which command sends a signal to a process?
    - A) signal
    - B) snd
    - C) sendsig
    - D) send
    - E) kill

24) To make a Linux link that ensures that the linked file exists even after the original file is deleted, which type of link would you create?
    - A) virtual
    - B) shortcut
    - C) soft
    - D) symbolic
    - E) hard

25) Which command pushes a directory on the stack?
    - A) push
    - B) pushd
    - C) pdir
    - D) pushdir
    - E) pwd

26) What is a Unix PPID?
    - A) person process ID
    - B) protected process ID
    - C) private process ID
    - D) protected parent ID
    - E) parent process ID

27) Which of the following Linux commands displays the last part of a file:
    - A) tail
    - B) tl
    - C) head
    - D) last
    - E) less

28) Which daemon is used to manage a machine's DNS?
    - A) dnsd
    - B) inetd
    - C) named
    - D) bind
    - E) iisd

29) What Unix command is used to list the contents of a directory?
    - A) ls
    - B) joe
    - C) rm
    - D) dir
    - E) cat

30) Which of the following best describes the Unix construct odyssey.infosys.bcit.ca
    - A) Network address for a user.
    - B) Nickname.
    - C) Hostname.
    - D) Domain.
    - E) Fully qualified hostname.

31) Which of the following bash variables can be used in a shell program to refer to the entire argument list?
    - A) $?
    - B) $#
    - C) $args
    - D) $@
    - E) $$

32) Which of the following permission sets belongs to a symbolic link?
    - A) twrxwrxwrx
    - B) lrwxrwxrw-
    - C) sr--r--r--
    - D) drwxrwx---
    - E) -rw-rw-rw-

33) Which command changes your login shell?
    - A) newsh
    - B) chngsh
    - C) chlg
    - D) cs
    - E) chsh

34) Which of the following is the correct Unix command to search for a word "superman" in a file called SuperHeroes?
    - A) grep -v superman SuperHeroes
    - B) grep -w superman SuperHeroes
    - C) grep -q superman SuperHeroes
    - D) grep superman SuperHeroes
    - E) grep -n superman SuperHeroes

35) In Linux System V, which of the following functions is performed by run level 3?
    - A) Reboots the system.
    - B) Enters single user mode.
    - C) Enters multiuser graphics mode.
    - D) Enters multiuser text mode.
    - E) Halts the system.

36) Where is the first place you might look when trying to locate a Linux daemon executable?
    - A) /var
    - B) /bin
    - C) /usr
    - D) /win/virus
    - E) /etc

37) Which Linux command gives you information such as how many lines are in a file?
    - A) wc
    - B) wl
    - C) w -l
    - D) w
    - E) nl

## TRUE/FALSE
Choose 'T' if the statement is true and 'F' if the statement is false.

38) Network attacks require a good knowledge of network theory and coding.

39) When a Unix process stops executing, it returns an exit status to its parent process. The shell stores the exit status of the last command in the $? variable.

40) The command less displays a text file one screen at a time

41) Linux has applications which make it possible to run some programs developed for other operating systems, such as MS-DOS, Microsoft Windows, and the Macintosh.

42) It is possible to set up Linux to read files on other partitions on the computer which are formatted for DOS, OS/2 or Windows 11.

43) One of the nice things about unix is that if you accidentally try to overwrite a file using redirection, you will get a warning so you will not lose any data.

44) Redirecting output to a file can distroy an existing file without error messages.

45) rsh, rlogin, rcp all have security risks.

46) The Linux command `tr -d '\r'` can be used as a filter to convert DOS/Windows text files to Unix text files.

47) Suppose person is a shell variable containing "Fred" The command `echo '$person'` will output the string `$person`

## SHORT ANSWER
Write the word or phrase that best completes each statement or answers the question.

48) What is the name of the Linux bit-bucket?

49) What command displays the name of the Linux machine you are working at?

50) Consider the following Unix commands. What is the output of the last command listed (cat hold)? Assume you type in the lines starting with the prompt bash$
    ```
    bash$ cat y
    This is y
    bash$ cat x y
    cat: x: No such file or directory
    This is y
    bash$ cat x y 1>hold 2>&1
    bash$ cat hold
    ```

51) What is Linux-PAM?

52) What Linux command creates a directory?

53) How can you find out what aliases you currently have defined on your Unix system?

54) What Unix command would you type to display the value of the variable myvar?

55) Give a Unix command which will display all of the lines in the files in the current working directory which do NOT contain the strings "bb" "bB" "Bb" or "BB"

For the following question(s) assume you have the following files in a directory on your computer:
```
libby1.jpg  libby2.jpg  libby3.jpg  libby4.jpg  libby5.jpg  libby6.jpg
libby7.jpg  libby8.jpg  libby9.jpg  libby10.jpg libby11.jpg libby12.jpg
libby1.txt
```

56) Which files would match `libby1*.jpg`

57) Which files would match `libby[6-8].jpg`

## ESSAY
Write your answer in the space provided.

58) Discuss and distinguish the similarities and differences between hard and soft links in Linux file systems.

59) Write a shell script that prints out a message "Your working directory is " followed by your working directory (all on one line)

60) Write a bash function that reads a parameter and writes (to standard out) the processes that contain that parameter in the output of ps aux
