import { useMemo, useState } from 'react';
import { repositoryCatalog } from '../data/mockData';

function RepositoriesPage() {
  const [query, setQuery] = useState('');
  const [newRepository, setNewRepository] = useState('');
  const [repositories, setRepositories] = useState(repositoryCatalog);

  const filteredRepositories = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return repositories;
    }

    return repositories.filter((repository) => repository.name.toLowerCase().includes(normalized));
  }, [query, repositories]);

  const handleAddRepository = (event) => {
    event.preventDefault();

    const trimmed = newRepository.trim();
    if (!trimmed) {
      return;
    }

    setRepositories((current) => [
      {
        id: Date.now(),
        name: trimmed,
        visibility: 'Private',
        platform: 'GitHub',
        status: 'Waiting for first sync',
        prsReviewed: 0,
        summary: 'New repository added from the RepoX repository manager.',
      },
      ...current,
    ]);
    setNewRepository('');
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="section-label">Repository Setup</p>
            <h2 className="section-title">Connect and manage repositories</h2>
          </div>
          <div className="section-actions">
            <button className="button button-secondary" type="button">
              Sync Repositories
            </button>
            <button className="button button-primary" type="button">
              Add from GitHub
            </button>
          </div>
        </div>

        <div className="toolbar">
          <input
            className="search-input search-input-standalone"
            type="search"
            placeholder="Search connected repositories"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <form className="inline-form" onSubmit={handleAddRepository}>
            <input
              className="field-input"
              type="text"
              placeholder="owner/repository-name"
              value={newRepository}
              onChange={(event) => setNewRepository(event.target.value)}
            />
            <button className="button button-primary" type="submit">
              Save Repository
            </button>
          </form>
        </div>
      </section>

      <section className="repository-grid">
        {filteredRepositories.map((repository) => (
          <article className="panel repository-card" key={repository.id}>
            <div className="card-topline">
              <h3 className="feature-title">{repository.name}</h3>
              <span className="status-pill">{repository.visibility}</span>
            </div>
            <p className="feature-copy">{repository.summary}</p>
            <div className="metadata-row">
              <span>{repository.platform}</span>
              <span>{repository.prsReviewed} PRs reviewed</span>
              <span>{repository.status}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default RepositoriesPage;
