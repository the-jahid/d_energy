'use client'

import { useEffect } from "react";

const VoiceChatbot =  () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://elevenlabs.io/convai-widget/index.js";
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);
    

        return () => {
          document.body.removeChild(script);
        };
      }, []);
    
    return (
        <div className="flex " >
           <div>
           <div className="w-32 bg-red-500 "
                    dangerouslySetInnerHTML={{
                        __html:
                        '<elevenlabs-convai agent-id="B8nP5INZRplub2qdSx7j"></elevenlabs-convai>',
                    }}
            />
           </div>
      
        </div>
    )
}

export default VoiceChatbot
