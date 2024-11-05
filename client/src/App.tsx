import ApplicationForm from "./components/ApplicationForm";

function App() {
  return (
    <div className="container my-5">
      <h1 className="display-4">InsuranceApp</h1>
      <p>
        Please submit the form below to receive an auto insurance quote. You may
        save the form and submit it later if needed.
      </p>
      <p>
        <a href="http://localhost:5173">Start New Application</a>
      </p>
      <div className="mt-5">
        <ApplicationForm />
      </div>
    </div>
  );
}

export default App;
