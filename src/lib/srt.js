function secondsToHHMMSS(timeString) {
    const d = new Date(parseFloat(timeString) * 1000);
    return d.toISOString().slice(11, 23).replace('.',',');
}



export function transcriptionItemsToSrt(items) {
    // let srt = '';
    // let i = 1;
    // items.forEach(item => {
    //     srt += i + "\n";

    //     //timestamps
    //     const { start_time, end_time } = item;
    //     srt += secondsToHHMMSS(start_time) + ' --> ' + secondsToHHMMSS(end_time) + "\n";



    //     //content
    //     srt += item.content + "\n";
    //     srt += "\n";
    //     i++;
    // })
    // return srt;
    let srt = '';
    let i = 1;
    items.filter(item => !!item).forEach(item => {
      // seq
      srt += i + "\n";
      // timestamps
      const {start_time, end_time} = item; // 52.345
      srt += secondsToHHMMSS(start_time)
        + ' --> '
        + secondsToHHMMSS(end_time)
        + "\n";
  
      // content
      srt += item.content + "\n";
      srt += "\n";
      i++;
    });
    return srt;
  }




