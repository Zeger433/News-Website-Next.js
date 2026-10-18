"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import {
  globalArticles,
  globalSidebarStories,
  bannerImage,
} from "@/app/data/articles";

export default function Global() {
  return (
    <main>
      <Header />

      <div className="abo">
        <div className="redcon"></div>
        <h1 className="aboutus">Latest in Global Market.</h1>
        <p className="hea">
          Get to know the talented journalists, editors and storytellers
        </p>
        <p className="hea">who bring you reliable, engaging.</p>
      </div>

      <section className="news-section">
        <div className="left-news">
          {globalArticles.map((article) => (
            <div key={article.id} className="carrd">
              <img src={article.imageUrl} alt={article.title} />
              <p className="author">
                {article.author} | {article.date}
              </p>
              <h3>{article.title}</h3>
            </div>
          ))}
        </div>

        <div className="sidebar">
          <div className="heading">
            <h2>Top Global Stories</h2>
            <Link href="/top-stories" className="see-all"></Link>
          </div>

          {globalSidebarStories.map((story) => (
            <div key={story.id} className="story">
              <img src={story.imageUrl} alt={story.category} />
              <div>
                <p className="category">
                  {story.category} {story.date}
                </p>
                <h4>{story.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <img className="clas" src={bannerImage.imageUrl} alt="image" />
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

      <Footer />
    </main>
  );
}
