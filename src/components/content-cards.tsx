import Link from 'next/link';
import { Icon } from './icon';
import { dateLabel, eventState, eventType, registrationState, officialEventUrl } from '@/lib/events';
import type { ArticleRecord, EventRecord, Project } from '@/lib/types';
export function EventCard({ event, large = false }: { event: EventRecord; large?: boolean }) {
  return (
    <article className={`event-card ${large ? 'event-card-large' : ''}`}>
      <a href={officialEventUrl(event)} className="event-image" target="_blank" rel="noreferrer">
        {event.image ? (
          <img
            src={event.image}
            alt={`${event.title} event poster`}
            loading="lazy"
            width="800"
            height="500"
          />
        ) : (
          <div className="event-typographic">
            <div className="cover-object">
              <Icon
                name={event.type === 'hackathon' ? 'code' : event.type === 'workshop' ? 'book' : 'mic'}
                size={45}
              />
            </div>
            <span>{event.title}</span>
            <span>{event.date.slice(0, 4)}</span>
          </div>
        )}
        <span className="image-arrow">
          <Icon name="diagonal" />
        </span>
      </a>
      <div className="event-card-meta">
        <span>
          {event.featured ? 'Featured · ' : ''}
          {eventType(event.type)}
        </span>
        <time dateTime={event.date}>{dateLabel(event.date, { month: 'short' })}</time>
      </div>
      <h3>
        <a href={officialEventUrl(event)} target="_blank" rel="noreferrer">
          {event.title}
        </a>
      </h3>
      <p>
        {event.venue}, {event.city}
      </p>
      {eventState(event) !== 'Past event' && (
        <p className="status-label">
          {eventState(event)} · {registrationState(event)}
        </p>
      )}
    </article>
  );
}
export function ArticleList({ articles }: { articles: ArticleRecord[] }) {
  return (
    <div className="article-list">
      {articles.map((article) => (
        <a key={article.slug} href={article.href} target="_blank" rel="noreferrer" className="article-row">
          {article.image ? (
            <img
              className="article-cover"
              src={article.image}
              alt=""
              width="640"
              height="360"
              loading="lazy"
            />
          ) : (
            <div className="article-cover article-cover-fallback">
              <Icon name="book" size={40} />
            </div>
          )}
          <div className="article-content">
            <div className="article-meta">
              <span>{article.topic}</span>
              <time dateTime={article.date}>{dateLabel(article.date, { month: 'short' })}</time>
            </div>
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <span className="article-author">By {article.author}</span>
          </div>
          <span className="article-destination">
            <span>
              Read on{' '}
              {new URL(article.href).hostname.endsWith('medium.com')
                ? 'Medium'
                : new URL(article.href).hostname.replace(/^www\./, '')}
            </span>
            <Icon name="diagonal" size={19} />
          </span>
        </a>
      ))}
    </div>
  );
}
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      {project.image_url && (
        <Link href={`/builds/${project.id}`}>
          <img
            src={project.image_url}
            alt={`${project.title} screenshot`}
            loading="lazy"
            width="800"
            height="500"
          />
        </Link>
      )}
      <div className="project-card-body">
        <div className="tag-row">
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <h3>
          <Link href={`/builds/${project.id}`}>{project.title}</Link>
        </h3>
        <p>{project.summary}</p>
        <div className="project-card-footer">
          <span>By {project.author?.name || 'A Krafter'}</span>
          <Link href={`/builds/${project.id}`} aria-label={`Explore ${project.title}`}>
            <Icon name="diagonal" />
          </Link>
        </div>
      </div>
    </article>
  );
}
