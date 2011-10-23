function login() {
    var data = {
        username: $("input[name=username]").val(),
        password: $("input[name=password]").val(),
    };
    var register = $("input[name=register]").attr("checked");
    $.ajax({
        type: register ? "POST" : "GET",
        url: register ? "/api/create_account" : "/api/login",
        data: data,
        success: function(reply) {
            var r = jQuery.parseJSON(reply);
            if (r.status == "ok") {
                document.cookie =
                    'auth='+r.auth+
                    '; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/';
                window.location.href = "/";
            } else {
                $("#errormsg").html(r.error)
            }
        }
    });
    return false;
}

function submit() {
    var data = {
        news_id: $("input[name=news_id]").val(),
        title: $("input[name=title]").val(),
        url: $("input[name=url]").val(),
        text: $("textarea[name=text]").val(),
        apisecret: apisecret
    };
    $.ajax({
        type: "POST",
        url: "/api/submit",
        data: data,
        success: function(reply) {
            var r = jQuery.parseJSON(reply);
            if (r.status == "ok") {
                window.location.href = "/news/"+r.news_id;
            } else {
                $("#errormsg").html(r.error);
            }
        }
    });
    return false;
}

function update_profile() {
    var data = {
        email: $("input[name=email]").val(),
        about: $("textarea[name=about]").val(),
        apisecret: apisecret
    };
    $.ajax({
        type: "POST",
        url: "/api/updateprofile",
        data: data,
        success: function(reply) {
            var r = jQuery.parseJSON(reply);
            if (r.status == "ok") {
                window.location.reload();
            } else {
                $("#errormsg").html(r.error);
            }
        }
    });
    return false;
}

function post_comment() {
    var data = {
        news_id: $("input[name=news_id]").val(),
        comment_id: $("input[name=comment_id]").val(),
        parent_id: $("input[name=parent_id]").val(),
        comment: $("textarea[name=comment]").val(),
        apisecret: apisecret
    };
    $.ajax({
        type: "POST",
        url: "/api/postcomment",
        data: data,
        success: function(reply) {
            var r = jQuery.parseJSON(reply);
            if (r.status == "ok") {
                if (r.op == "insert") {
                    window.location.href = "/news/"+r.news_id+"?r="+Math.random()+"#"+
                        r.news_id+"-"+r.comment_id;
                } else if (r.op == "update") {
                    window.location.href = "/editcomment/"+r.news_id+"/"+
                                           r.comment_id;
                } else if (r.op == "delete") {
                    window.location.href = "/news/"+r.news_id;
                }
            } else {
                $("#errormsg").html(r.error)
            }
        }
    });
    return false;
}

function processVote( id, direction ) {
  var data = {
      news_id: id,
      vote_type: direction,
      apisecret: apisecret
  };
  $.ajax({
      type: "POST",
      url: "/api/votenews",
      data: data,
      success: function(reply) {
          var r = jQuery.parseJSON(reply),
              elem = $("#"+id),
              children = elem.children();

          if (r.status == "ok") {
            children.eq(0).addClass("class", direction==="up" ? "voted" : "disabled");
            children.eq(3).addClass("class", direction==="up" ? "disabled" : "voted");
          } else {
              alert("Vote not registered: "+r.error);
          }
      }
  });
}

// Install the onclick event in all news arrows the user did not voted already.
$(document).ready(function() {
    $('news').each(function(i, news) {

        var $this = $(news),
            children = $this.children(),
            upClass = children.eq(0).attr("class"),
            downClass = children.eq(3).attr("class"),
            direction;

        if (!upClass) {
            direction = "up";
        }

        if (!downClass) {
            direction = "down";
        }

        if (direction) {
            processVote(news.id, direction);
        }
    });
});
