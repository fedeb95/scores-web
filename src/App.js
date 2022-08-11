import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import Account from "./components/Account"
import Home from "./components/Home";

function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const session = supabase.auth.session();
        setSession(session);

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session ?? null);
            }
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, [session]);

    return (
        <div className="overflow-clip">
            {!session ? <Auth /> : 
              <div className="overflow-clip">
                {/* <Account key={session.user.id} session={session} />  */}
                <Home user={session.user} />
              </div>
            }   
        </div>
    );
}

export default App;
