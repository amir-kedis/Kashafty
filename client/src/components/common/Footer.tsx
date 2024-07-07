// style
import "../../assets/styles/components/Footer.scss";

// GitHub icon
import GitHubLogo from "../../assets/images/github-logo.svg";

export default function Footer() {
  return (
    <footer className="Footer">
      <p>
        أعمال التصميم والتطوير تمت بواسطة فريق من طلاب هندسة القاهرة قسم حاسبات.
        للمزيد من المعلومات
      </p>

      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/CMP26Projects/ScoutManagementSystem"
      >
        <img src={GitHubLogo} alt="github logo" />
        <span>github</span>
      </a>
    </footer>
  );
}
