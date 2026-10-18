"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { authorsData, bannerImage } from "@/app/data/articles";

export default function Authors() {
  const sortedAuthors = [...authorsData].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  
  const rows = [];
  for (let i = 0; i < sortedAuthors.length; i += 3) {
    rows.push(sortedAuthors.slice(i, i + 3));
  }

  return (
    <main>
      <Header />

    
      <div className="abo">
        <div className="redcon"></div>
        <h1 className="aboutus">Meet the Authors</h1>
        <p className="hea">
          Get to know the talented journalists, editors, and storytellers who
          bring you reliable, engaging.
        </p>
      </div>

      {rows.map((row, rowIndex) => (
        <section key={rowIndex} className="auth">
          {row.map((author) => (
            <div key={author.id} className="autho">
              <img
                className="srca"
                src={author.imageUrl}
                alt={author.name}
              />
              <h2>{author.name}</h2>
              <p className="paraa">{author.role}</p>
            </div>
          ))}
        </section>
      ))}

      <img
        className="clas"
        src={bannerImage.imageUrl}
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

      <Footer />
    </main>
  );
}