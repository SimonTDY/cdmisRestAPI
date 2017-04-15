exports.wxTestApi = function (req, res) {
    // console.log(req.query);

    var ts = req.query.timestamp,
        sig = req.query.signature,
        nonce = req.query.nonce,
        echostr = req.query.echostr;

    var token = 'qbtest';

    // var sa = _.sortBy([ts, nonce, token], function(t){ return t; });  // 字典排序
    // console.log(sa);

    var sha1Gen = crypto.createHash('sha1');
    var input = [ts, nonce, token].sort().join('');  // .sort()对数组元素进行字典排序, .join('')必须加参数空字符''
    // console.log(input);
    var sha1 = sha1Gen.update(input).digest('hex');
    // console.log(sha1 + '\n' + sig);

    if (sha1 === sig) {
        res.status(200).send(echostr);  // 必须返回echostr, 不是true
    }
    else {
        res.sendStatus(400);
    }
};

exports.wxTestApiP = function (req, res) {
    console.log(req.body);

    
};

// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbeefa0d0e1830e92&redirect_uri=http%3A%2F%2Fweb.go5le.net/wx/getUserInfo&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbeefa0d0e1830e92&redirect_uri=http%3A%2F%2F7jxklkd7dv.proxy.qqbrowser.cc/v1/wx/getUserInfo&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
exports.wxGetUserInfo = function (req, res) {
    // console.log(req.query);
    if (!req.query.code) {
        return res.status(400).send('用户未授权!');
    }

    // 这里可以查询appid=wxbeefa0d0e1830e92是否存在有效期内的access_token, 有的话就直接使用, 没有的话就用refresh_token重新获取(同样要检查refresh_token是否过期, 没有或过期的话就用下面的完整代码重新获取)

    request.get({
        url: 'https://api.weixin.qq.com/sns/oauth2/access_token?' + 
        'appid=' + req.wxToken.appid + 
        '&secret=' + req.wxToken.secret + 
        '&code=' + req.query.code + 
        '&grant_type=authorization_code',
        json: true
    }, function (err, res1, body) {
        // console.log(body);
        if (!body.access_token || !body.openid) {
            return res.status(400).send('未获取令牌!');
        }

        // 这里可以保存body.access_token/body.expires_in/body.refresh_token, 以备重复调用

        request.get({
            url: 'https://api.weixin.qq.com/sns/userinfo?' + 
            'access_token=' + body.access_token + '&' + 
            'openid=' + body.openid + '&' + 
            'lang=zh_CN',
            json: true
        }, function (err, res2, body) {
            // console.log(body);
            if (!body.nickname) {
                return res.status(400).send('用户信息获取错误!');
            }

            // 这里可以根据获取的用户信息生成新的账号并登陆或直接登陆(unionid或openid在本地系统已经存在则直接登陆, 否则生成新账号并登陆)
            // var emuToken = '这里要被替换成真正的token, 可以根据openid查询本地系统中是否已经有该用户, 有的话就新生成一个token, 没有就新建一个用户并返回token, 下面带token参数访问/zh页面, 可以进行自动登录';
            // console.log('http://web.go5le.net/zh?token=' + emuToken);
            res.redirect(301, 'http://web.go5le.net/zh/#/login?token=token');  // 这里不能用中文? 
        });
    });
};

// 服务器端返回wx.config的所有参数
exports.wxJsSdkConfig = function (req, res) {
    // console.log(req.query);
    if (!req.wxToken) {
        return res.status(404).send('微信令牌不存在!');
    }

    var noncestr = randomstring.generate(16),
        jsapi_ticket = req.wxToken.jsapi_ticket,
        timestamp = Math.floor(Date.now() / 1000),
        // origin = req.get('origin') && 
        //          req.get('origin').match(/^https?:\/\/.*/) && 
        //          req.get('origin') || 
        //          (req.get('referer') && req.get('referer').match(/^https?:\/\/.*/) && req.get('referer')) ||
        //          req.get('host'),
        // host = origin.replace(/^https?:\/\/([^\/]*)\/?.*?\/?$/, '$1'),
        // domain = host.replace(/^.*?\./, '')
        // url = origin + req.originalUrl.substr(1)
        url = req.query.url
        ;

    // return res.send(url);

    var lookup = {};
    // lookup[noncestr] = 'noncestr';
    // lookup[jsapi_ticket] = 'jsapi_ticket';
    // lookup[timestamp] = 'timestamp';
    // lookup[url] = 'url';
    lookup['noncestr'] = noncestr;
    lookup['jsapi_ticket'] = jsapi_ticket;
    lookup['timestamp'] = timestamp;
    lookup['url'] = url;

    var sha1Gen = crypto.createHash('sha1');
    var sortedParams = ['jsapi_ticket', 'noncestr', 'timestamp', 'url'].sort();  // .sort()对数组元素进行字典排序
    var input = sortedParams[0] + '=' + lookup[sortedParams[0]] + '&' + sortedParams[1] + '=' + lookup[sortedParams[1]] + '&' + sortedParams[2] + '=' + lookup[sortedParams[2]] + '&' + sortedParams[3] + '=' + lookup[sortedParams[3]];
    // console.log(input);
    var sha1 = sha1Gen.update(input).digest('hex');

    res.json({
        // lookup: lookup,
        // input: input,
        results: {
            // debug: true, // 开启调试模式 调用的所有api的返回值会在客户端alert出来, 若要查看传入的参数, 可以在pc端打开, 参数信息会通过log打出, 仅在pc端时才会打印.
            appId: req.wxToken.appid, // 必填, 公众号的唯一标识
            timestamp: timestamp, // 必填, 生成签名的时间戳
            nonceStr: noncestr, // 必填, 生成签名的随机串
            signature: sha1,// 必填, 签名, 见附录1
            // jsApiList: ['chooseImage', 'previewImage', 'uploadImage'] // 必填, 需要使用的JS接口列表, 所有JS接口列表见附录2
        }
    });
};

// 服务器端获取微信临时素材
exports.wxJsSdkReqMedia = function (req, res, next) {
    // console.log(req.query);
    if (!req.wxToken) {
        return res.status(404).send('微信令牌不存在!');
    }

    var img = req.body.img;
    var d = new Date();
    var yyyy = moment(d).format('YYYY');
    var mm = moment(d).format('MM');
    var dd = moment(d).format('DD');
    var dest = path.join(__dirname, '../public/upload/sinokorea', yyyy, mm, dd);
    fs.ensureDirSync(dest);
    var name = 'sk_' + req.body.fileName.replace(/\s+/g, '-').toLowerCase().replace(/\.jpg/, '') + '_' + Date.now() + '.jpg';
    var filePath = dest + '/' + name;
    // console.log(dest);

    request
        .get('https://api.weixin.qq.com/cgi-bin/media/get?access_token=' + req.wxToken.token + '&media_id=' + img)
        .on('response', function (res) {
            // console.log(res.statusCode) // 200
            // console.log(res.headers['content-type']) // 'image/jpeg'
        })
        .on('error', function (err) {
            console.log(err)
        })
        .pipe(fs.createWriteStream(filePath))
        .on('close', function () {  // 没有参数传入
            // return res.json({results: img});
            req.body.file = {
                path: filePath,
                name: name
            };
            next()
        });
};