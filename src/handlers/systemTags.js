export default function systemTags() {
    let savedSystags = [];
    let savedCode = [];
    let id = 0;
    let code_id = 0;

    const systags_replacer = (text) => {
        savedSystags[id++] = text;
        return '##### svelte-md-systag-'+id+' #####';
    }

    const systags_restorator = (text,id) => {
        return savedSystags[id-1];
    }

    const code_replacer = (text) => {
        savedCode[code_id++] = text;
        return '##### svelte-md-code-'+code_id+' #####';
    }

    const code_restorator = (text,id) => {
        return savedCode[id-1];
    }

    const mdsv_parser = (text) => {
        if(!text.match(/<script[\S\s]*?>[\S\s]*?<\/script>/gmi)){
            const re_code = /(```[\w]+((?!```[\w])[\S\s])*)((import .* from .*)+)(((?!```[\w])[\S\s])*```(?![\w]))/gmi
            text = text.replace(re_code,code_replacer);

            const re = /^[\s]*(import .+ from .+)[\s]*$/gmi
            const imports = [];
            let res;
            while(res = re.exec(text)) imports.push(res[1]);

            if(imports.length > 0) {
                text = text.replace(re,'');
                text = `<script>\n  ${imports.join("\n  ")}\n</script>\n${text}`;
            }

            const re_uncode = /##### svelte\-md\-code-(\d+) #####/gmi
            text = text.replace(re_uncode,code_restorator);
        }
        return text;
    }

    const before = (text,processor) => {
        text = mdsv_parser(text);
        const re = /^[\s]*<(?:script|style)[^>]*>[\S\s]*?<\/.+>[\s]*$/gmi
        text = text.replace(re,systags_replacer);
        return text;
    }

    const after = (text,processor) => {
        const re = /(?:##### |<h5.*?>)svelte\-md\-systag\-(\d+)(?: #####|<\/h5>)/g;
        text = text.replace(re,systags_restorator);
        return text;
    }
    return {before,after}
}