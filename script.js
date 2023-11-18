$(document).ready(function() {
  var jsonObj = [];
  var queueList = [];

  $.getJSON(
    "https://raw.githubusercontent.com/jplehmann/textbites/master/textbites/data/NKJV.bible.json",
    function(json) {
      // point jsonObj to the .json file.
      jsonObj = json;

      //Populate booklist
      jsonObj.books.forEach(function(val, i) {
        var option = new Option(val.name, i, false, false);
        $("#booklist").append(option);
      });

      PopulateChapterList(0);

      PopulateVerseList(0, 0);
    }
  );

  function PopulateChapterList(bookindex) {
    // Clear Chapter List first
    document.getElementById("chapterlist").innerHTML = "";
    // Populate list
    jsonObj.books[bookindex].chapters.forEach(function(val, i) {
      var option = new Option(i + 1, i, false, false);
      $("#chapterlist").append(option);
    });
  }

  function PopulateVerseList(bookindex, chapterindex) {
    // Clear Verse List first
    document.getElementById("verselist").innerHTML = "";
    // Populate list
    jsonObj.books[bookindex].chapters[chapterindex].verses.forEach(function(
      val,
      i
    ) {
      var option = new Option(val.num, i, false, false);
      $("#verselist").append(option);
    });
  }

  function GetBookSelectedIndex() {
    // get booklist element
    var blist = document.getElementById("booklist");
    // get current selected book index from option value
    return blist.options[blist.selectedIndex].value;
  }

  function GetBookName() {
    // get booklist element
    var blist = document.getElementById("booklist");
    // get current selected book index from option value
    return blist.options[blist.selectedIndex].text;
  }

  function GetChapterSelectedIndex() {
    // get chapterlist element
    var clist = document.getElementById("chapterlist");
    // get current selected chapter index from option value
    return clist.options[clist.selectedIndex].value;
  }

  function GetChapterNumber() {
    // get chapterlist element
    var clist = document.getElementById("chapterlist");
    // get current selected chapter index from option value
    return clist.options[clist.selectedIndex].text;
  }

  function GetVerseSelectedIndex() {
    // get verselist element
    var vlist = document.getElementById("verselist");
    // get current selected verse index from option value
    return vlist.options[vlist.selectedIndex].value;
  }

  function GetVerseNumber() {
    // get verselist element
    var vlist = document.getElementById("verselist");
    // get current selected verse index from option value
    return vlist.options[vlist.selectedIndex].text;
  }

  function GetVerseText(bookindex, chapterindex, verseindex) {
    return jsonObj
      .books[bookindex].chapters[chapterindex].verses[verseindex].text;
  }

  // On booklist change,
  // populate the chapter list for
  // the current selected book
  $("#booklist").on("change", function() {
    // populate chapter list with chapters for selected book
    PopulateChapterList(GetBookSelectedIndex());
    // populate verse list for chapter 1
    PopulateVerseList(GetBookSelectedIndex(), 0);
  });

  // On chapterlist change,
  // populate the verse list for
  // the current selected chapter
  $("#chapterlist").on("change", function() {
    // populate verse list for chapter 1
    PopulateVerseList(GetBookSelectedIndex(), GetChapterSelectedIndex());
  });

  // On button click, show the verse
  // using the currently selected
  // book, chapter, and verse indexes
  $("#go-to-verse").on("click", function() {
    UpdateVerseText();
  });

  $("#add-to-queue").on("click", function() {
    var item = new QueuedVerse(
      GetBookSelectedIndex(),
      GetChapterSelectedIndex(),
      GetVerseSelectedIndex()
    );

    queueList.push(item);
  });

  function UpdateVerseText() {
    $("#verse-bg")
      .stop(true, true)
      .animate({ opacity: "100" });
    $("#verse-bg").fadeOut(200, function() {
      $("#verse").text(
        GetVerseText(
          GetBookSelectedIndex(),
          GetChapterSelectedIndex(),
          GetVerseSelectedIndex()
        )
      );
      $("#verse").css("font-size", "800%");
      $("#verse-bg").css("opacity", "0");
      $("#verse").css("opacity", "0");
    });

    $("#verse-info")
      .stop(true, true)
      .animate({ opacity: "100" });
    $("#verse-info").fadeOut(200, function() {
      $("#verse-info").text(
        "— " +
          GetBookName() +
          " " +
          GetChapterNumber() +
          " : " +
          GetVerseNumber()
      );
      $("#verse-info").css("opacity", "0");
    });

    $("#verse-info").fadeIn();
    $("#verse-bg").fadeIn(200, function() {
      var verseBg = document.getElementById("verse-bg");
      //var hasHorizontalScrollbar = verseBg.scrollWidth > verseBg.clientWidth;
      //var hasVerticalScrollbar = verseBg.scrollHeight > verseBg.clientHeight;
      //console.log(hasVerticalScrollbar);

      var elVerse = document.getElementById("verse");
      var fontSize = parseInt(elVerse.style.fontSize);

      while (verseBg.scrollHeight > verseBg.clientHeight) {
        fontSize = fontSize * 0.95;
        elVerse.style.fontSize = fontSize + "px";
      }

      $("#verse-bg").animate({ opacity: 100 }, 5000);
      $("#verse").animate({ opacity: 100 }, 5000);
      $("#verse-info").animate({ opacity: 100 }, 5000);
    });
  }

  //$("#searchbox").keyup(function() {
  //  $("#searchResults").html("");
  //  
  //  $("#searchResults").html(
  //    "Hey"
  //  );
  //});

  $("#next-verse").on("click", function() {
    GoToNext();
  });

  $("#previous-verse").on("click", function() {
    GoToPrevious();
  });

  document.onkeyup = function() {
    switch (window.event.keyCode) {
      case 37: // Left Arrow
        GoToPrevious();
        break;
      case 39: // Right Arrow
        GoToNext();
        break;
    }
  };

  function GoToPrevious() {
    var vlist = document.getElementById("verselist");
    if (vlist.selectedIndex > 0) {
      vlist.selectedIndex--;
      UpdateVerseText();
    }
  }

  function GoToNext() {
    if (queueList.length > 0) {
      queueList[0].display();
      queueList.shift();
      return;
    }
    var vlist = document.getElementById("verselist");
    if (vlist.selectedIndex < vlist.options.length - 1) {
      vlist.selectedIndex++;
      UpdateVerseText();
    }
  }

  function QueuedVerse(_bookIndex, _chapterIndex, _verseIndex) {
    this.bookIndex = _bookIndex;
    this.chapterIndex = _chapterIndex;
    this.verseIndex = _verseIndex;
  }

  QueuedVerse.prototype.display = function() {
    var blist = document.getElementById("booklist");
    blist.selectedIndex = this.bookIndex;

    var clist = document.getElementById("chapterlist");
    clist.selectedIndex = this.chapterIndex;

    var vlist = document.getElementById("verselist");
    vlist.selectedIndex = this.verseIndex;
    UpdateVerseText();
  };
});