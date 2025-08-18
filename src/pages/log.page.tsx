const LogPage = () => {
  return (
    <div>
      <pre>{JSON.stringify({}, undefined, 2)}</pre>
    </div>
  );
};

export default LogPage;
