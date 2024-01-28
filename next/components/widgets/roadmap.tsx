import React, { useEffect } from 'react'
import Head from 'next/head'

const Roadmap = () => {

    useEffect(() => {
        // We need to keep a reference to the widget instance so we can cleanup
        // when the component unmounts
        let widget: FrillWidget;

        // Define our config. You can get the key from the Widget code snippet
        const config: FrillConfig = {
            key: 'dfcb960b-3568-4b61-97ca-a33673f14d22',
            callbacks: {
                // This will be called when the widget is loaded
                onReady: (frillWidget) => {
                    widget = frillWidget;
                },
            },
        };

        // Let's check if the Frill script has already loaded
        if ('Frill' in window as any) {
            // If the Frill api is already available we can create the widget now
            widget = window.Frill.widget(config);
        } else {
            // If the Frill api hasn't been loaded, we need to add our config to the list.
            // When the api loads, it will create all widgets in the Frill_Config list and dispatch the
            // config.callbacks.onReady event for each
            window.Frill_Config = window.Frill_Config || [];
            window.Frill_Config.push(config);
        }

        // Return a cleanup method so we can remove the widget when the component unmounts
        return () => {
            // Check if there is an active widget
            if (widget) {
                // If there is a widget, destroy it, this will remove all event listeners and nodes added
                // to the DOM by the widget
                widget.destroy();
            }
            // We also need to remove our config from the list so it doesn't get initialised.
            // This would only happen if the had component mounted/unmounted before the Frill api
            // had a chance to load.
            if (window.Frill_Config) {
                window.Frill_Config = window.Frill_Config.filter((c) => c !== config);
            }
        };
    }, []);

    return (
        <>
            <Head>
                <script async src="https://widget.frill.co/v2/widget.js"></script>
            </Head>
        </>
    )
}

export default Roadmap