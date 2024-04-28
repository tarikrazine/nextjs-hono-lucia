interface EmailTemplateProps {
    email: string;
    code: string;
  }
  
  function EmailTemplate(props: EmailTemplateProps) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Welcome, {props.email}!</h1>
        <p className="text-lg font-bold">Your code: {props.code}</p>
      </div>
    );
  }
  
  export default EmailTemplate;