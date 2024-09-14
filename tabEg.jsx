import { useState } from "react"
import TabContainer from "./ui/components/ui/TabContainer";
import TabBar from "./ui/components/ui/TabBar";

function App() {

    const [tab, setTab] = useState(1);

    return (
        <>
            <div>
                <TabContainer>
                    <TabBar
                        tabName={"Tab A"}
                        tabActive={tab==1}
                        setTabActive={()=>{setTab(1)}}
                    />
                    <TabBar
                        tabName={"Tab B"}
                        tabActive={tab==2}
                        setTabActive={()=>{setTab(2)}}
                    />
                </TabContainer>

                {
                tab==1 &&
                <div>Content of Tab A</div>
                }

                {
                tab==2 &&
                <div>Content of Tab B</div>
                }

            </div>
        </>
    )
}

export default App
