"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { creators, responses } from "@/app/data/articles";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <main>
        <div className="loading-spinner">Loading articles...</div>
      </main>
    );
  }

  // Filter articles from database
  const featuredArticle = articles.find((a: any) => a.isFeatured === true);
  const worldNews = articles.slice(0, 2);
  const topStories = articles.slice(2, 10);
  const economyArticles = articles.filter(
    (a: any) => a.category?.name === "Economy",
  );
  const technologyArticles = articles.filter(
    (a: any) => a.category?.name === "Technology",
  );
  const scienceArticles = articles.filter(
    (a: any) => a.category?.name === "Science & Health",
  );
  const lifestyleArticles = articles.filter(
    (a: any) => a.category?.name === "Lifestyle",
  );
  const sportsArticles = articles.filter(
    (a: any) => a.category?.name === "Sports",
  );
  const globalMarketArticles = articles.filter(
    (a: any) => a.category?.name === "Global Market",
  );
  const otherArticles = articles.filter(
    (a: any) => a.category?.name === "Other",
  );

  return (
    <main>
      <Header />

      <div className="pink">
        <div className="ticker">
          <span className="ticker-item">
            Breaking News: Global markets react to new economic policies
          </span>
          <span className="ticker-dot">•</span>
          <span className="ticker-item">
            Elections 2025: Early polls show unexpected shifts
          </span>
          <span className="ticker-dot">•</span>
          <span className="ticker-item">
            President announces major education policy overhauls
          </span>
        </div>
      </div>

      <div className="Main">
        <div className="left-column">
          {/* ===== FEATURED STORY ===== */}
          {featuredArticle && (
            <div className="featured-section">
              <div className="image-container">
                <img
                  className="image"
                  src={featuredArticle.imageUrl || "/placeholder-image.jpg"}
                  alt={featuredArticle.title || "Featured article"}
                />
                <div className="image-overlay">
                  <span className="overlay-tag">
                    {featuredArticle.category?.name || "Featured"}
                  </span>
                  <p className="overlay-description">
                    {featuredArticle.excerpt || ""}
                  </p>
                </div>
              </div>
              <p className="global-title">{featuredArticle.title || ""}</p>
              <p className="para">{featuredArticle.content || ""}</p>
            </div>
          )}

          {/* ===== WORLD NEWS ===== */}
          <h2 className="section-title">World News</h2>

          <div className="news-row">
            {worldNews.map((article: any) => (
              <div key={article.id} className="news-item">
                <div className="news-image-wrapper">
                  <img
                    src={article.imageUrl || "/placeholder-image.jpg"}
                    alt={article.title || "Article"}
                    className="news-thumbnail"
                  />
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="author">
                      {article.author?.name || "Unknown"}
                    </span>
                    <span className="news-date">
                      {article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString()
                        : "Date unknown"}
                    </span>
                  </div>
                  <p className="news-title">{article.title || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== TOP GLOBAL STORIES ===== */}
        <div className="right-column">
          <div className="stories-header">
            <h2 className="section-title">Top Global Stories</h2>
            <Link href="/top-stories" className="see-all">
              See All →
            </Link>
          </div>

          {topStories.map((story: any) => (
            <div key={story.id} className="story-card">
              <div className="story-image-wrapper">
                <img
                  src={story.imageUrl || "/placeholder-image.jpg"}
                  alt={story.category?.name || "Story"}
                  className="story-image"
                />
              </div>
              <div className="story-info">
                <div className="story-meta">
                  <span className="story-category">
                    {story.category?.name || "General"}
                  </span>
                  <span className="story-dot">•</span>
                  <span className="story-date">
                    {story.createdAt
                      ? new Date(story.createdAt).toLocaleDateString()
                      : "Date unknown"}
                  </span>
                </div>
                <h3 className="story-title">{story.title || ""}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ECONOMY SECTION ===== */}
      <section className="economy-section">
        <div className="economy-grid">
          <div className="economy-left">
            <div className="economy-header">
              <h2 className="section-title">Economy</h2>
              <Link href="economy" className="see-all">
                See All →
              </Link>
            </div>

            <div className="economy-cards-row">
              {economyArticles.slice(0, 2).map((card: any) => (
                <div key={card.id} className="economy-card">
                  <div className="economy-card-image-wrapper">
                    <img
                      src={card.imageUrl || "/placeholder-image.jpg"}
                      alt={card.title || "Economy"}
                      className="economy-card-image"
                    />
                  </div>
                  <span className="economy-category">
                    {card.category?.name || "Economy"}
                  </span>
                  <p className="economy-date">
                    {card.createdAt
                      ? new Date(card.createdAt).toLocaleDateString()
                      : "Date unknown"}
                  </p>
                  <p className="economy-title">{card.title || ""}</p>
                </div>
              ))}
            </div>

            {economyArticles.slice(2, 3).map((card: any) => (
              <div key={card.id} className="economy-item">
                <div className="economy-item-image-wrapper">
                  <img
                    src={card.imageUrl || "/placeholder-image.jpg"}
                    alt={card.title || "Economy"}
                    className="economy-item-image"
                  />
                </div>
                <div className="economy-item-content">
                  <span className="economy-category">
                    {card.category?.name || "Economy"}
                  </span>
                  <p className="economy-date">
                    {card.createdAt
                      ? new Date(card.createdAt).toLocaleDateString()
                      : "Date unknown"}
                  </p>
                  <p className="economy-title">{card.title || ""}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="economy-right">
            <div className="economy-header">
              <h2 className="section-title">Technology</h2>
              <Link href="technology" className="see-all">
                See All →
              </Link>
            </div>

            {technologyArticles.slice(0, 1).map((article: any) => (
              <div key={article.id} className="tech-featured">
                <img
                  src={article.imageUrl || "/placeholder-image.jpg"}
                  alt={article.title || "Technology"}
                  className="tech-featured-image"
                />
                <span className="tech-tag">AI TECH</span>
                <div className="tech-featured-overlay">
                  <p className="tech-featured-description">
                    {article.excerpt || ""}
                  </p>
                  <div className="tech-featured-meta">
                    <span className="tech-author">
                      {article.author?.name || "Unknown"}
                    </span>
                    <span className="tech-date">
                      {article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString()
                        : "Date unknown"}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {technologyArticles.slice(1, 2).map((article: any) => (
              <div key={article.id} className="economy-item">
                <div className="economy-item-image-wrapper">
                  <img
                    src={article.imageUrl || "/placeholder-image.jpg"}
                    alt={article.title || "Technology"}
                    className="economy-item-image"
                  />
                </div>
                <div className="economy-item-content">
                  <div className="economy-author">
                    {article.author?.name || "Unknown"} |{" "}
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString()
                      : "Date unknown"}
                  </div>
                  <p className="economy-title">{article.title || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="updates">
        <div className="data">
          <h1 className="real">
            Follow us for real-time updates and breaking stories from around the
            world.
          </h1>

          <p className="para">
            Stay informed wherever you are — join our growing community of
            readers and followers across social platforms.
          </p>
        </div>
        <div className="logo">
          <img
            className="logoo"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM9mfLqALokkPMHIlDG8mCIYlgp-Fu8WjQVrdkqOaimg&s=10"
            alt="social"
          />
        </div>
      </div>

      {/* ===== SCIENCE & HEALTH ===== */}
      <section className="sci-health">
        <div className="sci-health-header">
          <span className="header-square"></span>
          <h2 className="sci-health-title">Science & Health</h2>
          <span className="header-line"></span>
          <Link href="science" className="see-all-red">
            See All →
          </Link>
        </div>

        <div className="cards">
          {scienceArticles.slice(0, 4).map((card: any) => (
            <div key={card.id} className="card">
              <img
                src={card.imageUrl || "/placeholder-image.jpg"}
                alt={card.title || "Science"}
                className="card-image"
              />
              <span className="card-tag">
                {card.category?.name || "Science"}
              </span>
              <p className="card-meta">
                {card.category?.name || "Science"}{" "}
                <span className="meta-dot">•</span>{" "}
                {card.createdAt
                  ? new Date(card.createdAt).toLocaleDateString()
                  : "Date unknown"}
              </p>
              <p className="card-desc">{card.title || ""}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SPORTS ===== */}
      <section className="sports-section">
        <div className="sports-header">
          <h2 className="sports-title">Sports and Entertainment</h2>
          <span className="sports-line"></span>
        </div>

        <div className="sports-grid-top">
          {sportsArticles.slice(0, 2).map((item: any) => (
            <div key={item.id} className="sports-feature">
              <img
                src={item.imageUrl || "/placeholder-image.jpg"}
                alt={item.title || "Sports"}
                className="sports-feature-image"
              />
              <span className="sports-tag">
                {item.category?.name || "Sports"}
              </span>
              <div className="sports-feature-overlay">
                <p>{item.title || ""}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="sports-grid-bottom">
          {sportsArticles.slice(2, 5).map((card: any) => (
            <div key={card.id} className="sports-card">
              <img
                src={card.imageUrl || "/placeholder-image.jpg"}
                alt={card.title || "Sports"}
                className="sports-card-image"
              />
              <p className="sports-card-desc">{card.title || ""}</p>
              <p className="sports-card-meta">
                {card.category?.name || "Sports"} |{" "}
                {card.createdAt
                  ? new Date(card.createdAt).toLocaleDateString()
                  : "Date unknown"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TOP CREATORS ===== */}
      <div className="containerr">
        <div className="headeer">
          <div className="headingWrapper">
            <div className="redBox"></div>
            <h1 className="creators">Top creators</h1>
          </div>
          <Link href="authors" className="seeAll">
            See All →
          </Link>
        </div>
      </div>

      <div className="list">
        {creators.map((creator) => (
          <div key={creator.id} className="first">
            <img className="creat" src={creator.imageUrl} alt={creator.name} />
            <div className="text">
              <h2 className="name">{creator.name}</h2>
              <p className="dess">{creator.company}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== LIFESTYLE ===== */}
      <div className="containerr">
        <div className="headeer">
          <div className="headingWrapper">
            <div className="redBox"></div>
            <h1 className="creators">lifestyle & Culture</h1>
          </div>
          <Link href="lifestyle" className="seeAll">
            See All →
          </Link>
        </div>
      </div>

      <section className="lifestyle">
        {lifestyleArticles.slice(0, 4).map((item: any) => (
          <div key={item.id} className="life">
            <img
              className="lif"
              src={item.imageUrl || "/placeholder-image.jpg"}
              alt={item.title || "Lifestyle"}
            />
            <p className="hi">
              {item.category?.name || "Lifestyle"}{" "}
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : "Date unknown"}
            </p>
            <h1 className="by">{item.title || ""}</h1>
          </div>
        ))}
      </section>

      {/* ===== GLOBAL MARKET ===== */}
      <div className="containerr">
        <div className="headeer">
          <div className="headingWrapper">
            <div className="redBox"></div>
            <h1 className="creators">Economy/Global Markets</h1>
          </div>
          <Link href="global" className="seeAll">
            See All →
          </Link>
        </div>
      </div>

      {globalMarketArticles.slice(0, 1).map((item: any) => (
        <section key={item.id} className="economy">
          <div className="leftpic">
            <img
              className="htt"
              src={item.imageUrl || "/placeholder-image.jpg"}
              alt="global market"
            />
          </div>
          <div className="descrip">
            <p className="market">
              #Markets |{" "}
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : "Date unknown"}
            </p>
            <h2 className="asia">{item.title || ""}</h2>
            <p className="oil">{item.excerpt || ""}</p>
            <button className="but">Read Full Story</button>
          </div>
        </section>
      ))}

      {/* ===== RESPONSES ===== */}
      <section className="responses">
        {responses.map((item) => (
          <div key={item.id} className="response">
            <h2 className="hh">{item.title}</h2>
            <p className="get">{item.description}</p>
            <div className="creator-info">
              <img
                className="small-avatar"
                src={item.imageUrl}
                alt={item.author}
              />
              <span className="creator-name-small">{item.author}</span>
            </div>
          </div>
        ))}
      </section>

      <img
        className="clas"
        src="https://cdn.prod.website-files.com/692401e8be8549a781fdbb92/692401e8be8549a781fdbcb8_Frame%202147228801.webp"
        alt="image"
      />
      <div className="blu">
        <h1 className="nam">Join 1M+ Readers </h1>
        <h1 className="nam">who never miss a headline. </h1>

        <p className="namm">
          Stay informed wherever you are — join our growing community
        </p>
        <p className="namm">
          of readers and followers across social platforms.
        </p>
        <button className="buton">Subscribe</button>
      </div>

      {/* ===== OTHER NEWS ===== */}
      <div className="containerr">
        <div className="headeer">
          <div className="headingWrapper">
            <div className="redBox"></div>
            <h1 className="creators">Other News</h1>
          </div>
          <Link href="news" className="seeAll">
            See All →
          </Link>
        </div>
      </div>

      <section className="other">
        {otherArticles.slice(0, 3).map((item: any) => (
          <div key={item.id} className="oth">
            <img
              className="sr"
              src={item.imageUrl || "/placeholder-image.jpg"}
              alt={item.title || "News"}
            />
            <p className="add">
              {item.author?.name || "Unknown"}{" "}
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : "Date unknown"}
            </p>
            <h3 className="james">{item.title || ""}</h3>
            <p className="add">{item.tags || ""}</p>
          </div>
        ))}
      </section>

      <div className="pin">
        <p>
          Elections 2025 : Early polls show unexpected shifts. President
          announces that major education policy overhauls. Breaking: Global
          markets react to new economic policies.
        </p>
      </div>

      <Footer />
    </main>
  );
}
