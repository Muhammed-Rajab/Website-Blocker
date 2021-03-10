# Importing necessary packages 
from flask import Flask, redirect, render_template, request

# Initializing a flask app
app = Flask(__name__)

# Routing to homepage
@app.route("/")
def home():
    return render_template("home.html")

# Handling 404 errors
@app.errorhandler(404)
def not_found_route(e):
    return render_template("404.html")

# route for adding website to blocked list
@app.route("/add", methods=["GET"])
def add_website():
    
    # Gets url to block from the request url
    url_to_block = request.args.get("url")

    # Opens hosts file as read-only and in append mode
    with open("/etc/hosts", 'r') as hosts, open("/etc/hosts", 'a') as appendHostsFile:
        # Check whether the url that user want to add is already present in hosts file
        # If it's present, then it will return message to front-end
        for line in hosts.readlines():
            if url_to_block in line:
                # print("link is already present")
                return "<span>Link already present in hosts file.</span>"
        else:
            # else it will append the url to hosts file
            appendHostsFile.write("\n"+"127.0.0.1 "+url_to_block)
    # Return success if the website is added to hosts successfully
    return "<span>link added successfully to blocked sites.</span>"

# Route to remove a website from file
"""
The front-end do an ajax call to hosts route to get the list of websites present in hosts file
When it responses, Javascript parses the request and displays the result to front-end.
When the user checkboxes the websites to remove, it do an ajax call to this route.
"""
def get_links_from_hosts():
    
    links = {}
    
    with open("/etc/hosts", "r") as hosts:
        count = 0
        for lines in hosts.readlines():
            if lines[0].strip() == "#" or lines == "\n":
                continue
            else:
                lines = lines.split()
                links[count] = lines[-1]
                count += 1 
    return links

@app.route("/remove")
def remove_website():

    # Getting the links to be removed from the list by using simple regex
    # For eg: The requested url will be like this
    # 127.0.0.1/remove?list=2:3:4:5
    # Here the websites that need to be removed are 2, 3, 4, 5
    # This are stored in a python Dictionary.
    linksToRemove = request.args.get("list").split(":")

    # Dictionary to store links
    links = get_links_from_hosts()
    
    with open("/etc/hosts", "r") as hosts:
        count = 0
        for lines in hosts.readlines():
            if lines[0].strip() == "#" or lines == "\n":
                continue
            else:
                lines = lines.split()
                links[count] = lines[-1]
                count += 1 

    # Creates an array of link with name that has to be removed from the list
    newLinks = [links[link] for link in links.keys() if str(link) in linksToRemove]

    # Opens hosts file with read and write permission
    with open("/etc/hosts", 'r+') as hosts:

        # Creates a new array to hold the values to be added to array
        hostStringArr =  []
        # Checks each line in the file and compare it with those in newLinks
        # If the the line is a comment or new line then appends it to the array
        # If the line is not in the newLinks then it appends it to the array
        # Everything else will be ignored
        for line in hosts.readlines():
            if line[0].strip() == "#" or line == "\n":
                hostStringArr.append(line)
            else:
                if line.strip().split()[-1] not in newLinks:
                    hostStringArr.append(line)
                    continue
        # This 2 lines completely removes the data inside the hosts file
        hosts.seek(0)
        
        hosts.truncate()

        # Writes the changes to hosts file
        hosts.writelines(hostStringArr)

        # Returns success note
        return "Site  successfully removed from blocked list"
    
    # If something bad happens then returns "error"
    return "error"

# Editing host functionality has to be imnplemented
@app.route("/edit", methods=["POST"])
def edit_hosts():
    return "<h1>Editing hosts file</h1>"

# This redirection also has to be implemented
@app.route("/redirect")
def redirected_page():
    return render_template("redirected_page.html")

# The route used by the front-end Js to fetch the links from hosts file
@app.route("/hosts", methods=["GET"])
def return_hosts():
    if request.method == "GET":
        # with open("/etc/hosts", "r") as hosts:
        #     count = 0
        #     for lines in hosts.readlines():
        #         if lines[0].strip() == "#" or lines == "\n":
        #             continue
        #         else:
        #             lines = lines.split()
        #             links[count] = lines[-1]
        #             count += 1 

        return get_links_from_hosts()


if __name__ == "__main__":

    app.run(debug=True)