import { useAuth } from "@/context/User";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";

function Logout() {
  const { logOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await logOut();
      if (response.status === "OK") console.log(response, "User logged out");
      router.replace("/", undefined, { shallow: false });
    } catch (error) {
      console.log("Failed to log out user", error);
    }
  };

  return (
    <>
      <button className={styles.button} onClick={handleLogout}>
        Log Out
      </button>
    </>
  );
}

export default Logout;
