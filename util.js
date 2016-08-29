

module.exports = {
    sortObject : function(list, key) {
        function compare(a, b) {
            a = a[key];
            b = b[key];
            var type = (typeof(a) === 'string' ||
                        typeof(b) === 'string') ? 'string' : 'number';
            var result;
            if (type === 'string') result = a.localeCompare(b);
            else result = a - b;
            return result;
        }
        return list.sort(compare);
    },
    levenshteinDistance : function(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        
        var costs = []
        
        for (var j = 0; j < b.length + 1; j++){
            costs[j] = j
        }
        for (var i = 1; i <= a.length; i++){
            costs[0] = i;
            var nw = i -1;
            for(var j = 1; j <= b.length; j++) {
                var cj = Math.min(1 + Math.min(costs[j], costs[j - 1]), a.charAt(i - 1) == b.charAt(j - 1) ? nw : nw + 1);
                nw = costs[j];
                costs[j] = cj;
            }
            return costs[b.length];
        }
    }
}