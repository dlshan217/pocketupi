function ProcessingPage() {
  return (
    <main className="processing-screen" role="status" aria-live="polite">
      <div className="processing-content">
        <span className="processing-spinner" aria-hidden="true" />
        <h1>Checking processing action</h1>
        <p>Please wait while we complete this step.</p>
      </div>
    </main>
  );
}

export default ProcessingPage;
