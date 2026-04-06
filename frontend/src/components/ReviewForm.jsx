import { useState } from 'react';

function ReviewForm() {
  const [repositoryUrl, setRepositoryUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Analyze clicked for:', repositoryUrl);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label className="input-label" htmlFor="repository-url">
        GitHub Repository URL
      </label>

      <div className="input-group">
        <input
          id="repository-url"
          className="repository-input"
          type="url"
          placeholder="https://github.com/owner/repository"
          value={repositoryUrl}
          onChange={(event) => setRepositoryUrl(event.target.value)}
        />

        <button className="analyze-button" type="submit">
          Analyze
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
