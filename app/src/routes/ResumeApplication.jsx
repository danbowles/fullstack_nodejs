import { json, useLoaderData } from "react-router-dom";

import Header from "../components/Header";

export async function loader({ params: { id } }) {
  const application = await fetch(`http://localhost:3000/application/${id}`).then((res) => res.json());
  return json({ application });
}

const ResumeApplication = () => {
  const { application } = useLoaderData();
  console.log(application);
  return (
    <>
      <Header headerText="Welcome Back" subTitleText="Continue where you left off!" />
    </>
  )
}

export default ResumeApplication;