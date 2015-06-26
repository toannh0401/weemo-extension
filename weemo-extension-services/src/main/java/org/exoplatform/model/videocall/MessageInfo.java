package org.exoplatform.model.videocall;

/**
 * Created by dongpd on 6/25/15.
 */
public class MessageInfo {
  private String type;
  private String fromUser;
  private String toUser;

  public String getFromUser() {
    return fromUser;
  }

  public void setFromUser(String fromUser) {
    this.fromUser = fromUser;
  }

  public String getToUser() {
    return toUser;
  }

  public void setToUser(String toUser) {
    this.toUser = toUser;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }
}
