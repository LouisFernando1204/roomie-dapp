import { adminNavList, userNavList } from "../../utils/list";

interface FooterProps {
  isUser: boolean;
  setIsUser: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Footer: React.FC<FooterProps> = ({ isUser, setIsUser }) => {
  const navList = isUser ? userNavList : adminNavList;
  const role = isUser ? "Admin" : "User";

  return (
    <footer className="bg-darkOrange shadow-md text-secondary w-full py-4 mt-12">
      <ul className="text-md flex items-center justify-center flex-col gap-7 md:flex-row md:gap-12 transition-all duration-500 py-5">
        <li>
          <span>
            ©
            <a className="font-bold" href="#">
              Roomie
            </a>{" "}
            2025, All rights reserved.
          </span>
        </li>

        {navList.map((nav, index) => (
          <li key={index}>
            <a className="font-semibold" href={`${nav.url}`}>
              {" "}
              {nav.title}{" "}
            </a>
          </li>
        ))}
        <li
          className="font-semibold cursor-pointer"
          onClick={() => setIsUser(!isUser)}
        >
          {role}
        </li>
      </ul>
    </footer>
  );
};
