import DiscoverActions from "./components/DiscoverActions/DiscoverActions";
import Header from "./components/Header/Header";
import TinderCards from "./components/TinderCards/TinderCards";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <Header />
      {/* Cards */}
      <TinderCards />
      {/* Bottom Buttons */}
      <DiscoverActions />
    </div>
  );
}
