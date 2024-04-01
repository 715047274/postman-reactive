let template = `<html>
    <head>
        <link rel="stylesheet" media="(prefers-color-scheme: light), (prefers-color-scheme: none)" href="https://cdn.jsdelivr.net/gh/swlkr/ridgecss@master/ridge-light.css" />
        <link rel="stylesheet" media="(prefers-color-scheme: dark)" href="https://cdn.jsdelivr.net/gh/swlkr/ridgecss@master/ridge-dark.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/swlkr/ridgecss@master/ridge.css" />
        <link rel="stylesheet" href="https://unpkg.com/pyloncss@latest/css/pylon.css"/>
        <style>
            .button, button, input[type=button], input[type=reset], input[type=submit] {
                line-height:unset;
            }
            input {
                font-family: monospace;
            }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/jsonpath@1.0.2/jsonpath.min.js"></script>
        <script src="https://gistcdn.githack.com/marcus-at-localhost/dc19e9dd97743a1ef2fe039342e25b9e/raw/92702909c8a350f220ee1996df57834a6f8c2d91/alpine-csp.js" defer></script>
    </head>
    <body>
        <main id="jQ" x-data="jsonQuery">
            <hstack spacing="s">
                <input stretch @keyup="exec" :value="query" style="width:100%;" type="text" placeholder="Example query: $..parameters[?(@.type==7)]">
                <divider></divider>
                <button @click="resetQuery">Reset</button>
            </hstack>
            <details>
                <summary>Queries</summary>
                <a href="https://goessner.net/articles/JsonPath/index.html#e3">JSONPath Help</a>
                <pre>$..parameters[?(@.type==7)]</pre>
            </details>
            <div x-show="errorMsg" x-html="errorMsg" class="pa-s bg-background-alt br-xs"></div>
            <pre x-html="htmlData"></pre>
        </main>
        <script>
            document.addEventListener("alpine:init", () => {
                pm.getData( (error, value) => { 
                    console.info(value)
                    Alpine.store('extractedData', value);
                    // access Alpine from outside
                    let el = document.getElementById('jQ')._x_dataStack[0];
                    el.filteredData = jsonpath.query(Alpine.store('extractedData'), localStorage.getItem('query') ?? '?');
                    el.htmlData = JSON.stringify(el.filteredData, null, 2);
                });
                Alpine.data("jsonQuery", () => ({
                    query: "",
                    filteredData: "",
                    htmlData: "",
                    errorMsg: "",
                    init() {
                        console.log('init');
                        this.query = localStorage.getItem('query');
                    },
                    exec($event) {
                        try {
                            this.query = $event.target.value;
                            localStorage.setItem("query", this.query);
                            this.filteredData = jsonpath.query(Alpine.store('extractedData'), this.query);
                            this.htmlData = JSON.stringify(this.filteredData, null, 2);
                        } catch (err) {
                            //console.info(err);
                            this.errorMsg = JSON.stringify(err, null, 2);
                        }
                    },
                    resetQuery() {
                        localStorage.removeItem('query');
                        this.query = "";
                        this.errorMsg = "";
                    }
                }));
            });
        </script>
    </body>
</html>`;

pm.visualizer.set(template, pm.response.json());
