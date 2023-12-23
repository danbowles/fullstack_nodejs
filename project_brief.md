# NodeJS FullStack
## <a name="_uplyhscpde0z"></a>Scenario

At Hugo, customers often start the insurance application process on an external third party site, where that third party site then sends the collected information to our service so that the user can continue their application process and receive a price quote.
## <a name="_7b8wiojmwvph"></a>Task
### <a name="_4lipr4g4hbsg"></a>Backend
Create a web API that exposes four endpoints:
* POST route that starts a new insurance application and initializes it with the provided data
	* This route should return a “resume” route that points to the frontend URL to load the created application
* GET route that can retrieve the current insurance application
* PUT route that will update the insurance application with provided data
	* This should accept partial fields from the quote application. Each submitted field needs to pass validation in order to be updated.
	* The quote application as a whole may still be incomplete and should not cause this route to fail.
* POST route that validates the entire application and returns a price
	* You do not actually need to do any calculation here, returning a random number value would be sufficient
### <a name="_843d81tynuk9"></a>Frontend
Create a React frontend that can display the current application state, and can allow information to be added or edited. The frontend should do basic validation, and when all the required information is completely filled out, allow the application to be submitted for completion, and display either an error message if the application is not complete or the quoted price to purchase insurance.
### <a name="_whu7smguo1fw"></a>Data Specifications
The data that an insurance application needs consists of the following:
- First and Last name
- Date of Birth (validate that input is a date and at least 16 years old)
- Address
  - Street
  - City
  - State
  - ZipCode (validate numeric, but don’t worry about validating if zip code exists)
- Vehicle(s) (must have 1 vehicle, cannot have more than 3 total)
  - VIN
  - Year (validate numeric and valid year between 1985 and current year + 1)
  - Make and Model
## <a name="_n4jmjh99yy1u"></a>Guidelines
- Provide setup instructions for the frontend and backend projects
- The submission should be self-contained and ran locally. Please avoid connecting to external services or databases. Instructions/scripts to provision local databases should be included with the submission.
- Feel free to use any starter kit/bootstrapping tools you feel comfortable with to create the initial project (i.e. create-react-app, vite, etc for the front end)
- Don’t focus too much on the styling/UX of the frontend. Focus more on component organization/structure
- Backend can use any flavor of SQL for data storage.
  - Ensure that the frontend can resume the same application if the page is closed and reopened
## <a name="_5ibwvplu5pcc"></a>Stretch Goals
Implement the following if you have time or can plan to include within the time frame:
- Use TypeScript with appropriate type definitions
- Allow adding additional people to the insurance application:
  - First and Last name
  - Date of Birth
  - Relationship (Spouse, Sibling, Parent, Friend, Other)