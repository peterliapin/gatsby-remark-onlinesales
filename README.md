# gatsby-remark-onlinesales

Processs markdown images and replaces relative links like `/api/images/image.png` to absolute `https://[onlinesales-backend-url]/api/images/image.png` so they available to be proceeded with  `gatsby-remark-images-remote`


# Install

    npm install gatsby-remark-onlinesales

# How to setup

    {
	    resolve: `gatsby-transformer-remark`,
	    options: {
		    plugins: [
			    {
				    resolve: 'gatsby-remark-onlinesales',
				    options: {
						url:  `${process.env.GATSBY_URL}`
					}
			    }
		    ]
	    }
    }

# Options
`url` : domain name to be concatenated with markdown image url

# Supported versions

|                |ASCII                          
|----------------|-------------------------------
|Gatsby 5|`Unknown`            
|Gatsby 4         |`Supported`            
|Gatsby 3         |`Unknown`