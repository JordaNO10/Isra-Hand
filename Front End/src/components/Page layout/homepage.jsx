import React from "react";
import "./css/style.css";
import "./css/homepage.css";
import mainpicture from "./assets/mainpicture.png";
const Homepage = () => {
  return (
    <div className="main">
      <h1 className="h1-homepage">
        "תֵּן לִי בְּנֵי אָדָם, וְהִנֵּה אֲנִי אֶתֶּן-לָךְ נֶפֶשׁ"
      </h1>
      <article className="mainpage-article">
        <figure>
          <img src={mainpicture} alt="A beautiful sunset" />
          <figcaption>באדיבות : רשת 13</figcaption>
        </figure>
        <h1>הזמן לתרום – עכשיו יותר מתמיד</h1>
        <p>
          בזמן מלחמה, רבים מאיתנו חווים קשיים ואתגרים יומיומיים, אך ישנם אנשים
          שמצבם קשה פי כמה. תרומות עכשיו יכולות לעשות את ההבדל – בין אם מדובר
          במתן סיוע רפואי, מזון או מקלט לאנשים שזקוקים להם ביותר.
        </p>
        <p>
          כל תרומה, קטנה או גדולה, יכולה להציל חיים ולעזור בהקלה על כאבם של
          אחרים. עכשיו, יותר מאי פעם, עלינו להושיט יד ולעזור למי שזקוק לנו.
        </p>
        <p>
          יחד, אנחנו יכולים לעמוד מול האתגרים ולהפוך את העולם למקום טוב יותר
          עבור כולנו.
        </p>
      </article>
    </div>
  );
};

export default Homepage;
