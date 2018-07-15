#  API:URL Shortener Microservice 

created by [@saifsmailbox98](https://github.com/saifsmailbox98)

:octocat:[Github Repository](https://github.com/saifsmailbox98/url-shortener)

 ## How it works:
 1. If passed a URL as a parameter, it will return a shortened URL in the JSON response. 
 1. When the shorten url is visited, it will redirect to the original link.


 ## Example creation usage:

```https://sho.herokuapp.com/https://www.google.com``` *[:link:](https://sho.herokuapp.com/https://www.google.com)*

```https://sho.herokuapp.com/http://foo.com:80``` *[:link:](https://sho.herokuapp.com/http://foo.com:80)*

 ## Example creation output:

```{"original_url":"http://foo.com:80","short_url":"http://sho.herokuapp.com/g71ac5"}```

 ## Usage:

```https://sho.herokuapp.com/g71ac5``` *[:link:](https://sho.herokuapp.com/g71ac5)*

 ## Will redirect to:

```http://foo.com:80```

 ## Live sites:

[sho.herokuapp.com](https://sho.herokuapp.com/)

[sh.glitch.me](https://sh.glitch.me/)
