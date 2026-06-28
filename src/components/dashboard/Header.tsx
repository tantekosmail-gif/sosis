import SearchBar from "./SearchBar";
import Notification from "./Notification";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  return (
    <header
      className="
      sticky
      top-0
      z-40
      flex
      h-20
      items-center
      justify-between
      border-b
      bg-background/70
      backdrop-blur-xl
      px-8
      "
    >
      <SearchBar />

      <div className="flex gap-4">

        <Notification />

        <ProfileMenu />

      </div>
    </header>
  );
}